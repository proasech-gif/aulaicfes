import 'react-native-url-polyfill/auto';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, Image, Linking, Platform, ScrollView, Share, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity as T, Vibration, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

// ===== Configuración (la llave anon es pública; la seguridad la dan las políticas RLS de Supabase) =====
const SB_URL = 'https://bwcluuunbaxpmdpscekg.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Y2x1dXVuYmF4cG1kcHNjZWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODM3NDYsImV4cCI6MjEwODk1OTc0Nn0.0Pi0yGf_fHVBjWJJdlkxO6yVvEa1_RBY4-izbsMCDCs';
const WEB = 'https://yersonmorenodiaz7-cmyk.github.io/cerquita-transporte/';
const supabase = createClient(SB_URL, SB_KEY, { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } });

// Las notificaciones locales suenan y vibran aunque la app esté en segundo plano
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: false, shouldShowBanner: false, shouldShowList: false, shouldPlaySound: false, shouldSetBadge: false }) });

// Tarea en segundo plano: mantiene la ubicación del conductor al día aunque la app esté minimizada
const BG_TASK = 'cerquita-bg-location';
TaskManager.defineTask(BG_TASK, async ({ data, error }) => {
  if (error || !data?.locations?.length) return;
  const c = data.locations[data.locations.length - 1].coords;
  const id = await AsyncStorage.getItem('cq_driver_id');
  if (!id) return;
  await supabase.from('driver_locations').upsert({ driver_id: id, lat: c.latitude, lng: c.longitude, heading: c.heading, updated_at: new Date().toISOString() });
});
const b64ToBuffer = b64 => { const bin = globalThis.atob(b64), bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return bytes.buffer; };

const C = { p: '#1769ff', d: '#12a150', bg: '#f4f6f8', card: '#fff', br: '#dfe4e9', mut: '#66727e', fg: '#10181f', red: '#d92d3a' };
const ST = { searching: 'Buscando ofertas', accepted: 'Conductor en camino', arrived: 'Tu conductor llegó', ongoing: 'En viaje', completed: 'Viaje finalizado', cancelled: 'Cancelado', expired: 'Expirado' };
const ACT = ['searching', 'accepted', 'arrived', 'ongoing'];
const $c = n => '$' + Math.round(n || 0).toLocaleString('es-CO');
const hav = (a, b) => { const t = x => x * Math.PI / 180, h = Math.sin(t(b.lat - a.lat) / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(t(b.lng - a.lng) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
const q = async p => { const { data, error } = await p; if (error) { console.log(error.message); return undefined; } return data; };
const m = async p => { const { error } = await p; if (error) { Alert.alert('CERQUITA', error.message); return false; } return true; };
const nameOf = async (lat, lng) => { try { const [a] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }); return [a?.street || a?.name, a?.district || a?.city].filter(Boolean).join(', ') || 'Punto seleccionado'; } catch (e) { return 'Punto seleccionado'; } };
const pt = o => ({ latitude: o.lat, longitude: o.lng });

// ===== Componentes básicos =====
const Btn = ({ t, onPress, color = C.p, ghost, small, style }) => (
  <T onPress={onPress} style={[s.btn, { backgroundColor: ghost ? 'transparent' : color, borderColor: ghost ? C.br : color, paddingVertical: small ? 8 : 13 }, style]}>
    <Text style={{ color: ghost ? C.fg : '#fff', fontWeight: '700' }}>{t}</Text>
  </T>
);
const Chip = ({ t, on, onPress, color }) => (
  <T onPress={onPress} style={[s.chip, on && { backgroundColor: color, borderColor: color }]}><Text style={{ color: on ? '#fff' : C.fg }}>{t}</Text></T>
);
const Card = ({ children }) => <View style={s.card}>{children}</View>;
const Mut = ({ children }) => <Text style={{ color: C.mut, fontSize: 13 }}>{children}</Text>;
const Input = props => <TextInput placeholderTextColor={C.mut} {...props} style={[s.input, props.style]} />;

// ===== Raíz: sesión =====
export default function App() {
  const [session, setSession] = useState(null), [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: l } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess));
    const app = AppState.addEventListener('change', st => { if (st === 'active') supabase.auth.startAutoRefresh(); else supabase.auth.stopAutoRefresh(); });
    return () => { l.subscription.unsubscribe(); app.remove(); };
  }, []);
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />
      {!ready ? <ActivityIndicator style={{ flex: 1 }} size="large" color={C.p} /> : session ? <Main user={session.user} /> : <Auth />}
    </View>
  );
}

function Auth() {
  const [up, setUp] = useState(false), [email, setEmail] = useState(''), [pass, setPass] = useState(''), [name, setName] = useState(''), [busy, setBusy] = useState(false);
  const go = async () => {
    if (!email || pass.length < 8) return Alert.alert('CERQUITA', 'Escribe tu correo y una contraseña de mínimo 8 caracteres.');
    setBusy(true);
    if (!up) { const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass }); if (error) Alert.alert('CERQUITA', error.message); }
    else {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pass, options: { data: { full_name: name } } });
      if (error) Alert.alert('CERQUITA', error.message); else if (!data.session) Alert.alert('CERQUITA', 'Cuenta creada. Revisa tu correo para confirmarla y luego ingresa.');
    }
    setBusy(false);
  };
  const forgot = async () => {
    if (!email.trim()) return Alert.alert('CERQUITA', 'Escribe tu correo arriba y vuelve a tocar este enlace.');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: WEB + 'reset.html' });
    Alert.alert('CERQUITA', error ? error.message : 'Te enviamos un correo con un enlace para crear una nueva contraseña.');
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80 }} keyboardShouldPersistTaps="handled">
      <Text style={[s.logo, { fontSize: 32 }]}>📍 CERQUITA</Text>
      <Mut>Movilidad, cercanía, confianza y rapidez</Mut>
      <Card>
        <Text style={s.h}>{up ? 'Crear cuenta' : 'Ingresar'}</Text>
        {up && <Input placeholder="Nombre completo" value={name} onChangeText={setName} />}
        <Input placeholder="Correo" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input placeholder="Contraseña" value={pass} onChangeText={setPass} secureTextEntry />
        <Btn t={busy ? 'Un momento…' : up ? 'Registrarme' : 'Entrar'} onPress={go} />
        <Btn t={up ? 'Ya tengo cuenta' : 'Crear cuenta'} ghost onPress={() => setUp(!up)} style={{ marginTop: 8 }} />
        {!up && <T onPress={forgot}><Text style={{ color: C.p, textAlign: 'center', marginTop: 14 }}>¿Olvidaste tu contraseña?</Text></T>}
      </Card>
    </ScrollView>
  );
}

// ===== Principal: datos compartidos y tiempo real =====
function Main({ user }) {
  const uid = user.id;
  const [role, setRole] = useState('p'), [B, setB] = useState(null), [D, setD] = useState({});
  const timer = useRef(null);

  const refresh = useCallback(async () => {
    const drv = (await q(supabase.from('drivers').select('*,vehicles(model,plate)').eq('user_id', uid).maybeSingle())) || null;
    const rides = (await q(supabase.from('rides').select('*').eq('passenger_id', uid).order('created_at', { ascending: false }).limit(30))) || [];
    const rated = new Set(((await q(supabase.from('ratings').select('ride_id').eq('from_user', uid))) || []).map(x => x.ride_id));
    const ride = rides.find(r => ACT.includes(r.status) || (r.status === 'completed' && !rated.has(r.id))) || null;
    let offers = [], pd = null, loc = null, pay = null;
    if (ride) {
      if (ride.status === 'searching') offers = (await q(supabase.from('offers').select('*,drivers(display_name,rating_avg,vehicles(model,plate))').eq('ride_id', ride.id).eq('status', 'pending').order('price'))) || [];
      else if (ride.driver_id) {
        pd = (await q(supabase.from('drivers').select('user_id,display_name,rating_avg,vehicles(model,plate)').eq('id', ride.driver_id).maybeSingle())) || null;
        loc = (await q(supabase.from('driver_locations').select('lat,lng').eq('driver_id', ride.driver_id).maybeSingle())) || null;
        pay = (await q(supabase.from('payments').select('amount,discount_amount,status,method').eq('ride_id', ride.id).maybeSingle())) || null;
      }
    }
    let req = [], mo = [], cur = null, dh = [], plan = null, docs = [], wallet = [];
    if (drv) {
      if (drv.online && drv.status === 'approved') req = ((await q(supabase.from('rides').select('*').eq('status', 'searching').eq('category', drv.category).order('created_at', { ascending: false }))) || []).filter(r => r.passenger_id !== uid);
      mo = (await q(supabase.from('offers').select('ride_id,price').eq('driver_id', drv.id))) || [];
      wallet = (await q(supabase.from('wallet_transactions').select('amount,kind,note,created_at').eq('driver_id', drv.id).order('created_at', { ascending: false }).limit(8))) || [];
      docs = (await q(supabase.from('driver_documents').select('doc_type,status,created_at').eq('driver_id', drv.id).order('created_at'))) || [];
      cur = ((await q(supabase.from('rides').select('*,payments(commission_amount,discount_amount)').eq('driver_id', drv.id).in('status', ['accepted', 'arrived', 'ongoing']).limit(1))) || [])[0] || null;
      dh = (await q(supabase.from('payments').select('amount,commission_amount,rides!inner(driver_id,status)').eq('rides.driver_id', drv.id).eq('rides.status', 'completed').limit(100))) || [];
      plan = ((await q(supabase.from('driver_subscriptions').select('ends_at,plans(name,commission_pct)').eq('driver_id', drv.id).gt('ends_at', new Date().toISOString()).order('ends_at', { ascending: false }).limit(1))) || [])[0] || null;
    }
    setD({ drv, ride, offers, pd, loc, req, mo, cur, dh, plan, rides, pay, docs, wallet });
  }, [uid]);

  useEffect(() => {
    (async () => {
      const p = await q(supabase.from('profiles').select('*').eq('id', uid).single());
      const cfg = await q(supabase.from('settings').select('*').single());
      const cats = Object.fromEntries(((await q(supabase.from('service_categories').select('*').eq('active', true))) || []).map(c => [c.code, c]));
      setB({ p, cfg, cats });
      refresh();
    })();
    const deb = () => { clearTimeout(timer.current); timer.current = setTimeout(refresh, 300); };
    const ch = supabase.channel('cq-' + uid);
    ['rides', 'offers', 'driver_locations'].forEach(t => ch.on('postgres_changes', { event: '*', schema: 'public', table: t }, deb));
    ch.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: 'user_id=eq.' + uid }, p => Alert.alert(p.new.title, p.new.body || ''));
    ch.subscribe();
    return () => { clearTimeout(timer.current); supabase.removeChannel(ch); };
  }, [uid, refresh]);

  // Cuando un pasajero elige al conductor, la app lo lleva sola a la pantalla del viaje
  useEffect(() => { if (D.cur?.id) setRole('d'); }, [D.cur?.id]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async st => {
      if (st !== 'active') return;
      try { await supabase.functions.invoke('wompi-sync'); } catch (e) {}
      refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('solicitudes', { name: 'Solicitudes y avisos', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 500, 300, 500], sound: 'default' });
        const perm = await Notifications.requestPermissionsAsync();
        if (!perm.granted) return;
        const tok = await Notifications.getExpoPushTokenAsync();
        await supabase.rpc('register_push_token', { p_token: tok.data, p_platform: Platform.OS });
      } catch (e) { console.log('push:', e?.message); }
    })();
  }, [uid]);

  if (!B || !B.cfg) return <ActivityIndicator style={{ flex: 1 }} size="large" color={C.p} />;
  const staff = ['operador', 'supervisor', 'admin'].includes(B.p?.role);
  const tabs = [['p', 'Pasajero', C.p], ['d', 'Conductor', C.d]].concat(staff ? [['a', 'Admin', '#6d4aff']] : []);
  const props = { uid, cfg: B.cfg, cats: B.cats, D, refresh };
  return (
    <View style={{ flex: 1 }}>
      <View style={s.top}>
        <Text style={s.logo}>📍 CERQUITA</Text>
        {tabs.map(([k, l, col]) => <Chip key={k} t={l} on={role === k} color={col} onPress={() => setRole(k)} />)}
        <Chip t="Salir" onPress={() => supabase.auth.signOut()} />
      </View>
      {role === 'p' && <Passenger {...props} />}
      {role === 'd' && <Driver {...props} />}
      {role === 'a' && <ScrollView contentContainerStyle={{ padding: 12 }}><Card><Text style={s.h}>Administración</Text><Mut>El panel de administración (conductores, tarifas, viajes y alertas) está en la versión web.</Mut><Btn t="Abrir panel web" color="#6d4aff" onPress={() => Linking.openURL(WEB)} style={{ marginTop: 10 }} /></Card></ScrollView>}
    </View>
  );
}

// ===== Historial de viajes y comprobante =====
function History({ rides = [] }) {
  const list = rides.filter(x => ['completed', 'cancelled', 'expired'].includes(x.status)).slice(0, 10);
  if (!list.length) return null;
  const share = x => Share.share({ message: `Comprobante CERQUITA\nFecha: ${new Date(x.created_at).toLocaleString('es-CO')}\nRuta: ${x.origin_name} → ${x.dest_name}\nDistancia: ${x.distance_km} km\nTarifa acordada: ${$c(x.agreed_fare)}\nPago: ${x.payment_method}\nEstado: ${ST[x.status]}` });
  return (
    <Card>
      <Text style={s.h}>Mis viajes</Text>
      {list.map(x => (
        <View key={x.id} style={s.offer}>
          <View style={{ flex: 1 }}><Text style={{ fontWeight: '700' }}>{x.origin_name} → {x.dest_name}</Text><Mut>{new Date(x.created_at).toLocaleDateString('es-CO')} · {ST[x.status]}</Mut></View>
          <Text style={{ fontWeight: '800', marginHorizontal: 8 }}>{x.agreed_fare ? $c(x.agreed_fare) : '—'}</Text>
          {x.status === 'completed' && <Btn t="Comprobante" ghost small onPress={() => share(x)} />}
        </View>
      ))}
    </Card>
  );
}

// ===== Reportar un problema (reclamaciones) =====
function Report({ uid, rideId }) {
  const [open, setOpen] = useState(false), [kind, setKind] = useState('Cobro'), [txt, setTxt] = useState('');
  const send = async () => {
    if (txt.trim().length < 10) return Alert.alert('CERQUITA', 'Cuéntanos qué pasó (mínimo 10 letras).');
    if (await m(supabase.from('claims').insert({ user_id: uid, ride_id: rideId || null, kind, description: txt.trim() }))) {
      Alert.alert('CERQUITA', 'Recibimos tu reclamación. Te responderemos pronto.'); setTxt(''); setOpen(false);
    }
  };
  if (!open) return <T onPress={() => setOpen(true)}><Text style={{ color: C.mut, textAlign: 'center', marginVertical: 10 }}>¿Tuviste un problema? Reportar</Text></T>;
  return (
    <Card>
      <Text style={s.h}>Reportar un problema</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        {['Cobro', 'Conductor', 'Seguridad', 'Otro'].map(k => <Chip key={k} t={k} on={kind === k} color={C.p} onPress={() => setKind(k)} />)}
      </ScrollView>
      <Input placeholder="Cuéntanos qué pasó" value={txt} onChangeText={setTxt} multiline style={{ minHeight: 80, textAlignVertical: 'top' }} maxLength={500} />
      <View style={s.row}><Btn t="Enviar" small onPress={send} /><Btn t="Cancelar" ghost small onPress={() => setOpen(false)} /></View>
    </Card>
  );
}

// ===== Chat del viaje (solo mientras el viaje está activo) =====
function Chat({ rideId, uid, who }) {
  const [msgs, setMsgs] = useState([]), [txt, setTxt] = useState('');
  const load = useCallback(async () => {
    const d = await q(supabase.from('messages').select('id,sender_id,body,created_at').eq('ride_id', rideId).order('created_at'));
    if (d) setMsgs(d);
  }, [rideId]);
  useEffect(() => {
    load();
    const ch = supabase.channel('chat-' + rideId).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'ride_id=eq.' + rideId }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [rideId, load]);
  const send = async () => {
    const b = txt.trim(); if (!b) return;
    setTxt('');
    await m(supabase.from('messages').insert({ ride_id: rideId, sender_id: uid, body: b }));
    load();
  };
  return (
    <Card>
      <Text style={s.h}>💬 Chat con {who}</Text>
      {msgs.length === 0 && <Mut>Escribe un mensaje para coordinar la recogida.</Mut>}
      {msgs.slice(-20).map(x => (
        <View key={x.id} style={{ alignSelf: x.sender_id === uid ? 'flex-end' : 'flex-start', backgroundColor: x.sender_id === uid ? C.p : C.bg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginVertical: 3, maxWidth: '80%' }}>
          <Text style={{ color: x.sender_id === uid ? '#fff' : C.fg }}>{x.body}</Text>
        </View>
      ))}
      <View style={[s.row, { marginTop: 8 }]}>
        <Input style={{ flex: 1, marginBottom: 0 }} placeholder="Escribe un mensaje" value={txt} onChangeText={setTxt} onSubmitEditing={send} returnKeyType="send" maxLength={500} />
        <Btn t="Enviar" small onPress={send} />
      </View>
    </Card>
  );
}

// ===== Rutas (con tráfico si hay llave de Google) =====
const decodePoly = str => {
  let i = 0, lat = 0, lng = 0; const out = [];
  while (i < str.length) {
    let b, shift = 0, res = 0;
    do { b = str.charCodeAt(i++) - 63; res |= (b & 31) << shift; shift += 5; } while (b >= 32);
    lat += (res & 1) ? ~(res >> 1) : (res >> 1);
    shift = 0; res = 0;
    do { b = str.charCodeAt(i++) - 63; res |= (b & 31) << shift; shift += 5; } while (b >= 32);
    lng += (res & 1) ? ~(res >> 1) : (res >> 1);
    out.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return out;
};
function useRoutes(from, to, enabled) {
  const [data, setData] = useState({ routes: [], source: null });
  const [sel, setSel] = useState(0);
  const fromRef = useRef(from); fromRef.current = from;
  const tKey = to ? `${to.lat},${to.lng}` : '';
  const hasFrom = !!from;
  useEffect(() => {
    if (!enabled || !to || !hasFrom) { setData({ routes: [], source: null }); return; }
    let alive = true;
    const load = async () => {
      const f = fromRef.current; if (!f) return;
      const { data: d, error } = await supabase.functions.invoke('route', { body: { from: { lat: f.lat, lng: f.lng }, to: { lat: to.lat, lng: to.lng } } });
      if (!alive || error || !d?.routes) return;
      setData({ routes: d.routes.map(x => ({ ...x, pts: decodePoly(x.polyline) })), source: d.source });
      setSel(v => Math.min(v, d.routes.length - 1));
    };
    load();
    const t = setInterval(load, 45000);
    return () => { alive = false; clearInterval(t); };
  }, [enabled, hasFrom, tKey]);
  return { ...data, sel, setSel };
}
const mins = sec => Math.max(1, Math.round(sec / 60));

// Pantalla completa del viaje para el conductor: mapa, rutas, tráfico y acciones
function DriverTrip({ cur, pos, next, uid }) {
  const mr = useRef(null);
  const target = cur.status === 'accepted' ? { lat: cur.origin_lat, lng: cur.origin_lng } : cur.status === 'ongoing' ? { lat: cur.dest_lat, lng: cur.dest_lng } : null;
  const rt = useRoutes(pos, target, !!target);
  const rr = rt.routes[rt.sel];
  useEffect(() => { if (rr?.pts?.length) mr.current?.fitToCoordinates(rr.pts, { edgePadding: { top: 80, right: 60, bottom: 60, left: 60 }, animated: true }); }, [cur.status, rt.routes.length, rt.sel]);
  const pay = [].concat(cur.payments || [])[0];
  const openNav = () => target && Linking.openURL(`https://www.google.com/maps/dir/?api=1${pos ? `&origin=${pos.lat},${pos.lng}` : ''}&destination=${target.lat},${target.lng}&travelmode=driving&dir_action=navigate`);
  return (
    <View style={{ flex: 1 }}>
      <MapView ref={mr} provider={PROVIDER_GOOGLE} showsTraffic showsUserLocation style={{ flex: 1 }} initialRegion={{ latitude: cur.origin_lat, longitude: cur.origin_lng, latitudeDelta: .05, longitudeDelta: .05 }}>
        <Marker coordinate={{ latitude: cur.origin_lat, longitude: cur.origin_lng }} pinColor="green" title="Recoger" />
        <Marker coordinate={{ latitude: cur.dest_lat, longitude: cur.dest_lng }} pinColor="red" title="Destino" />
        {rt.routes.map((x, i) => (i === rt.sel ? null : <Polyline key={i} coordinates={x.pts} strokeColor="#9aa5b1" strokeWidth={4} tappable onPress={() => rt.setSel(i)} />))}
        {rr && <Polyline coordinates={rr.pts} strokeColor={C.d} strokeWidth={6} />}
      </MapView>
      <View style={{ backgroundColor: C.card, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 14, maxHeight: '58%', borderColor: C.br, borderWidth: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={s.h}>{cur.status === 'accepted' ? '🚗 Ve a recoger al pasajero' : cur.status === 'arrived' ? '📍 Esperando al pasajero' : '🚦 Viaje en curso'}</Text>
          <Text>{cur.passenger_name} · {cur.origin_name} → {cur.dest_name} · {cur.distance_km} km</Text>
          {rt.routes.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {rt.routes.map((x, i) => <Chip key={i} t={`${i === 0 ? '⚡ ' : ''}${mins(x.duration_traffic_s)} min · ${(x.distance_m / 1000).toFixed(1)} km${x.summary ? ' · ' + x.summary : ''}`} on={rt.sel === i} color={C.d} onPress={() => rt.setSel(i)} />)}
              </ScrollView>
              <Mut>{rt.source === 'google' ? '⚡ = ruta más rápida con el tráfico de ahora. Toca una ruta para elegirla.' : 'Rutas disponibles. Toca una para elegirla. El mapa muestra el tráfico: verde fluido, rojo congestionado.'}</Mut>
            </View>
          )}
          <PickupInfo r={cur} />
          <Text style={{ color: C.d, fontWeight: '700', marginTop: 8 }}>💵 Cobra al pasajero {$c(cur.agreed_fare - (pay?.discount_amount || 0))} ({cur.payment_method})</Text>
          {(pay?.discount_amount || 0) > 0 && <Mut>Usó un descuento: CERQUITA te lo devuelve en tu saldo.</Mut>}
          <Mut>Tarifa acordada {$c(cur.agreed_fare)} (neto {$c(cur.agreed_fare - (pay?.commission_amount || 0))})</Mut>
          {target && <Btn t="🧭 Navegar con Google Maps" ghost small onPress={openNav} style={{ marginTop: 8 }} />}
          <Btn t={{ accepted: 'Confirmar llegada', arrived: 'Iniciar viaje', ongoing: 'Finalizar viaje' }[cur.status]} color={C.d} onPress={() => next(cur.id)} style={{ marginTop: 8, marginBottom: 8 }} />
          <Chat rideId={cur.id} uid={uid} who={cur.passenger_name || 'el pasajero'} />
        </ScrollView>
      </View>
    </View>
  );
}

// ===== Pasajero =====
function Passenger({ uid, cfg, cats, D, refresh }) {
  const [o, setO] = useState(null), [d, setDest] = useState(null), [c, setC] = useState('carro'), [pr, setPr] = useState(null), [pay, setPay] = useState('efectivo'), [busy, setBusy] = useState(false), [oq, setOq] = useState(''), [dq, setDq] = useState(''), [promo, setPromo] = useState(''), [promoMsg, setPromoMsg] = useState(null), [note, setNote] = useState(''), [photo, setPhoto] = useState(null);
  const mr = useRef(null);
  const r = D.ride;
  useEffect(() => {
    (async () => {
      let lat = 6.3373, lng = -75.5579, ok = false;
      try { const { status } = await Location.requestForegroundPermissionsAsync(); if (status === 'granted') { const p = (await Location.getCurrentPositionAsync({})).coords; lat = p.latitude; lng = p.longitude; ok = true; } } catch (e) {}
      const nm = ok ? await nameOf(lat, lng) : 'Parque de Bello';
      setO({ lat, lng, name: nm }); setOq(nm);
    })();
  }, []);
  useEffect(() => { if (o && !d && !r) mr.current?.animateToRegion({ latitude: o.lat, longitude: o.lng, latitudeDelta: .04, longitudeDelta: .04 }, 400); }, [o]);
  useEffect(() => {
    const pad = { top: 60, right: 60, bottom: 60, left: 60 };
    if (r) mr.current?.fitToCoordinates([{ latitude: r.origin_lat, longitude: r.origin_lng }, { latitude: r.dest_lat, longitude: r.dest_lng }], { edgePadding: pad, animated: true });
    else if (o && d) mr.current?.fitToCoordinates([pt(o), pt(d)], { edgePadding: pad, animated: true });
  }, [d, r?.id]);

  const [near, setNear] = useState([]), [counts, setCounts] = useState({});
  useEffect(() => {
    if (!o || r) return;
    let alive = true;
    const load = async () => {
      const { data } = await supabase.rpc('nearby_drivers', { p_lat: o.lat, p_lng: o.lng, p_category: c });
      if (alive && data) setNear(data);
      const cn = await supabase.rpc('nearby_counts', { p_lat: o.lat, p_lng: o.lng });
      if (alive && cn.data) setCounts(Object.fromEntries(cn.data.map(x => [x.category, x.n])));
    };
    load();
    const t = setInterval(load, 10000);
    return () => { alive = false; clearInterval(t); };
  }, [o?.lat, o?.lng, c, r?.id]);

  const k = (() => {
    if (!o || !d || !cats[c]) return null;
    const km = Math.max(.3, hav(o, d) * 1.3), kk = Math.round(km * 10) / 10, cc = cats[c];
    const ref = Math.round((cfg.base_fare * cc.base_multiplier + kk * cc.per_km) / 100) * 100;
    return { km: kk, min: Math.max(4, Math.ceil(km / (c === 'moto' ? 30 : 24) * 60)), ref, lo: Math.ceil(ref * cfg.min_offer_pct / 100), hi: Math.floor(ref * cfg.max_offer_pct / 100) };
  })();
  const price = pr ?? k?.ref ?? 0;

  // Búsqueda de direcciones escritas (geocodificación)
  const geo = async text => {
    try {
      const res = await Location.geocodeAsync(`${text}, Antioquia, Colombia`);
      if (!res.length) return null;
      const { latitude: lat, longitude: lng } = res[0];
      return { lat, lng, name: await nameOf(lat, lng) };
    } catch (e) { return null; }
  };
  const findO = async () => { if (!oq.trim()) return; const g = await geo(oq); if (!g) return Alert.alert('CERQUITA', 'No encontré esa dirección. Prueba con calle, número y barrio (ej: Calle 50 #45-10, Bello).'); setO(g); setOq(g.name); };
  const findD = async () => { if (!dq.trim()) return; const g = await geo(dq); if (!g) return Alert.alert('CERQUITA', 'No encontré esa dirección. Prueba con calle, número y barrio, o toca el mapa.'); setPr(null); setDest(g); setDq(g.name); };
  const myLoc = async () => { try { const p = (await Location.getCurrentPositionAsync({})).coords; const nm = await nameOf(p.latitude, p.longitude); setO({ lat: p.latitude, lng: p.longitude, name: nm }); setOq(nm); } catch (e) { Alert.alert('CERQUITA', 'Activa el GPS y el permiso de ubicación.'); } };

  const PayBox = () => (D.pay ? <Mut>Pagas directamente al conductor: {$c(D.pay.amount - D.pay.discount_amount)} · {D.pay.method}</Mut> : null);
  const pickPhoto = async camera => {
    try {
      const perm = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert('CERQUITA', 'Necesito permiso para usar la cámara o tus fotos.');
      const res = camera ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 }) : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5, mediaTypes: ['images'] });
      if (!res.canceled && res.assets?.[0]?.base64) setPhoto({ uri: res.assets[0].uri, b64: res.assets[0].base64 });
    } catch (e) { Alert.alert('CERQUITA', 'No se pudo abrir la cámara o la galería.'); }
  };
  const applyPromo = async () => {
    if (!promo.trim()) return setPromoMsg(null);
    const { data, error } = await supabase.rpc('check_promo', { p_code: promo, p_fare: price });
    if (error) return Alert.alert('CERQUITA', error.message);
    setPromoMsg(data.ok ? { ok: true, t: `✔ Descuento estimado: ${$c(data.discount)} (lo asume CERQUITA)` } : { ok: false, t: data.message });
  };
  const pick = async e => { if (r) return; const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate; setPr(null); const nm = await nameOf(lat, lng); setDest({ lat, lng, name: nm }); setDq(nm); };
  const request = async () => {
    if (!k) return Alert.alert('CERQUITA', 'Toca el mapa para elegir tu destino.');
    if (price < k.lo || price > k.hi) return Alert.alert('CERQUITA', `Tu oferta debe estar entre ${$c(k.lo)} y ${$c(k.hi)}.`);
    if (!(counts[c] > 0)) {
      const go = await new Promise(res => Alert.alert('Sin conductores cerca', `Ahora no hay conductores conectados de ${cats[c]?.name} cerca de ti. ¿Quieres pedir de todas formas o cambiar de categoría?`, [
        { text: 'Cambiar categoría', style: 'cancel', onPress: () => res(false) },
        { text: 'Pedir igual', onPress: () => res(true) },
      ]));
      if (!go) return;
    }
    setBusy(true);
    let photoPath = null;
    if (photo) {
      photoPath = `${uid}/${Date.now()}.jpg`;
      const up = await supabase.storage.from('ride-photos').upload(photoPath, b64ToBuffer(photo.b64), { contentType: 'image/jpeg' });
      if (up.error) { setBusy(false); return Alert.alert('CERQUITA', 'No se pudo subir la foto: ' + up.error.message); }
    }
    const ok = await m(supabase.from('rides').insert({ passenger_id: uid, category: c, origin_name: o.name, origin_lat: o.lat, origin_lng: o.lng, dest_name: d.name, dest_lat: d.lat, dest_lng: d.lng, offered_fare: price, payment_method: pay, promo_code: promo.trim() || null, pickup_note: note.trim() || null, pickup_photo_path: photoPath }));
    setBusy(false); if (ok) { setPr(null); setDest(null); setPromo(''); setPromoMsg(null); setNote(''); setPhoto(null); refresh(); }
  };
  const accept = async id => { const { error } = await supabase.rpc('accept_offer', { p_offer: id }); if (error) Alert.alert('CERQUITA', 'La oferta ya no está disponible.'); refresh(); };
  const cancel = async id => { const { error } = await supabase.rpc('cancel_ride', { p_ride: id }); if (error) Alert.alert('CERQUITA', error.message); refresh(); };
  const rate = async n => { if (D.pd && await m(supabase.from('ratings').insert({ ride_id: r.id, from_user: uid, to_user: D.pd.user_id, stars: n }))) refresh(); };
  const sos = async () => { if (await m(supabase.from('sos_alerts').insert({ ride_id: r?.id, user_id: uid, lat: o?.lat, lng: o?.lng }))) Alert.alert('CERQUITA', 'Alerta enviada al centro de operaciones.'); };

  const veh = D.pd?.vehicles?.[0];
  // Posición del conductor en tiempo real (sin esperar a que se refresque la pantalla)
  const [live, setLive] = useState(null);
  useEffect(() => {
    setLive(null);
    const did = r?.driver_id;
    if (!did || !['accepted', 'arrived', 'ongoing'].includes(r.status)) return;
    const ch = supabase.channel('trk-' + did)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_locations', filter: 'driver_id=eq.' + did }, p => { if (p.new?.lat) setLive({ lat: p.new.lat, lng: p.new.lng }); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [r?.driver_id, r?.status]);
  const drvPos = live || D.loc;
  const target = r && ['accepted', 'arrived'].includes(r.status) ? { lat: r.origin_lat, lng: r.origin_lng } : r && r.status === 'ongoing' ? { lat: r.dest_lat, lng: r.dest_lng } : null;
  const rt = useRoutes(drvPos, target, !!target && r?.status !== 'arrived');
  useEffect(() => {
    const rr = rt.routes[rt.sel];
    if (r && rr?.pts?.length) mr.current?.fitToCoordinates(rr.pts, { edgePadding: { top: 70, right: 70, bottom: 70, left: 70 }, animated: true });
  }, [r?.status, rt.routes.length]);
  const shareTrip = () => {
    const at = D.loc || o;
    Share.share({ message: `Voy en un viaje CERQUITA con ${D.pd?.display_name || 'mi conductor'} (${veh?.model || ''} ${veh?.plate || ''}).\nRuta: ${r.origin_name} → ${r.dest_name}.\n${at ? `Ubicación: https://www.google.com/maps?q=${at.lat},${at.lng}` : ''}` });
  };
  const A = r ? { lat: r.origin_lat, lng: r.origin_lng } : o, B = r ? { lat: r.dest_lat, lng: r.dest_lng } : d;
  return (
    <View style={{ flex: 1 }}>
      <MapView ref={mr} provider={PROVIDER_GOOGLE} showsTraffic style={{ height: r ? 360 : 280 }} showsUserLocation onPress={pick} initialRegion={{ latitude: 6.3373, longitude: -75.5579, latitudeDelta: .06, longitudeDelta: .06 }}>
        {A && <Marker coordinate={pt(A)} pinColor="green" title="Origen" />}
        {B && <Marker coordinate={pt(B)} pinColor="red" title="Destino" />}
        {A && B && !r && <Polyline coordinates={[pt(A), pt(B)]} strokeColor={C.p} strokeWidth={3} />}
        {rt.routes[rt.sel] && <Polyline coordinates={rt.routes[rt.sel].pts} strokeColor={C.p} strokeWidth={5} />}
        {drvPos && <Marker coordinate={pt(drvPos)} title="Tu conductor"><Text style={{ fontSize: 28 }}>🚕</Text></Marker>}
        {!r && near.map((x, i) => <Marker key={i} coordinate={pt(x)} title="Conductor cercano"><Text style={{ fontSize: 22 }}>🚕</Text></Marker>)}
      </MapView>
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {!r && (
          <Card>
            <Text style={s.h}>¿A dónde vas?</Text>
            <Mut>Dirección de recogida</Mut>
            <View style={[s.row, { marginBottom: 8 }]}>
              <Input style={{ flex: 1, marginBottom: 0 }} placeholder="¿Dónde te recogemos?" value={oq} onChangeText={setOq} onSubmitEditing={findO} returnKeyType="search" />
              <Btn t="Buscar" small onPress={findO} />
            </View>
            <T onPress={myLoc}><Text style={{ color: C.p, marginBottom: 8 }}>📍 Usar mi ubicación actual</Text></T>
            <Mut>Dirección de destino</Mut>
            <View style={[s.row, { marginBottom: 4 }]}>
              <Input style={{ flex: 1, marginBottom: 0 }} placeholder="¿A dónde vas?" value={dq} onChangeText={setDq} onSubmitEditing={findD} returnKeyType="search" />
              <Btn t="Buscar" small onPress={findD} />
            </View>
            <Mut>También puedes tocar el mapa para marcar el destino.</Mut>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {Object.values(cats).map(x => <Chip key={x.code} t={`${x.name.replace('CERQUITA ', '')} · ${counts[x.code] || 0}`} on={c === x.code} color={C.p} onPress={() => { setC(x.code); setPr(null); }} />)}
            </ScrollView>
            <Mut>{near.length ? `🚕 ${near.length} conductor(es) cerca de ti` : 'Aún no hay conductores conectados cerca de ti'}</Mut>
            {k && <>
              <Mut>{k.km} km · ~{k.min} min · Referencia {$c(k.ref)} (puedes ofertar entre {$c(k.lo)} y {$c(k.hi)})</Mut>
              <View style={s.row}><Btn t="−" ghost small onPress={() => setPr(Math.max(500, price - 500))} /><Text style={s.price}>{$c(price)}</Text><Btn t="+" ghost small onPress={() => setPr(price + 500)} /></View>
            </>}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              {[['efectivo', 'Efectivo'], ['transferencia', 'Transferencia (Nequi, etc.)']].map(([v, l]) => <Chip key={v} t={l} on={pay === v} color={C.p} onPress={() => setPay(v)} />)}
            </View>
            <Mut>¿Tu dirección no tiene nomenclatura? Ayuda al conductor a encontrarte:</Mut>
            <Input placeholder="Punto de referencia (ej: casa azul frente a la tienda)" value={note} onChangeText={setNote} maxLength={200} style={{ marginTop: 6 }} />
            {photo ? (
              <View style={{ marginBottom: 10 }}>
                <Image source={{ uri: photo.uri }} style={{ height: 160, borderRadius: 10 }} />
                <Btn t="Quitar foto" ghost small onPress={() => setPhoto(null)} style={{ marginTop: 6 }} />
              </View>
            ) : (
              <View style={[s.row, { marginBottom: 10 }]}><Btn t="📷 Foto de la entrada" ghost small onPress={() => pickPhoto(true)} /><Btn t="🖼️ Galería" ghost small onPress={() => pickPhoto(false)} /></View>
            )}
            <View style={[s.row, { marginBottom: 6 }]}>
              <Input style={{ flex: 1, marginBottom: 0 }} placeholder="Código de descuento (opcional)" value={promo} onChangeText={t => { setPromo(t); setPromoMsg(null); }} autoCapitalize="characters" />
              <Btn t="Aplicar" ghost small onPress={applyPromo} />
            </View>
            {promoMsg && <Text style={{ color: promoMsg.ok ? C.d : C.red, marginBottom: 8 }}>{promoMsg.t}</Text>}
            <Btn t={busy ? 'Enviando…' : 'Proponer mi precio'} onPress={request} />
          </Card>
        )}
        {!r && <History rides={D.rides} />}
        {r && r.status === 'searching' && (
          <Card>
            <Text style={s.h}>Ofertas recibidas ({D.offers.length}/{cfg.max_offers})</Text>
            <Mut>Tu precio {$c(r.offered_fare)} · referencia {$c(r.reference_fare)}</Mut>
            {D.offers.length === 0 && <Text style={{ marginVertical: 12, color: C.mut }}>Esperando conductores cercanos…</Text>}
            {D.offers.map(f => (
              <View key={f.id} style={s.offer}>
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '700' }}>{f.drivers?.display_name} ★ {f.drivers?.rating_avg}</Text><Mut>{f.drivers?.vehicles?.[0]?.model} · llega en {f.eta_minutes} min</Mut></View>
                <Text style={{ fontWeight: '800', marginHorizontal: 10 }}>{$c(f.price)}</Text>
                <Btn t="Aceptar" small onPress={() => accept(f.id)} />
              </View>
            ))}
            <Btn t="Cancelar solicitud" ghost small onPress={() => cancel(r.id)} style={{ marginTop: 10 }} />
          </Card>
        )}
        {r && r.status === 'completed' && (
          <Card>
            <Text style={s.h}>Llegaste a tu destino</Text>
            <Text>Total a pagar: {$c(r.agreed_fare - (D.pay?.discount_amount || 0))} · {r.payment_method}{D.pay?.discount_amount > 0 ? ` (descuento ${$c(D.pay.discount_amount)})` : ''}</Text>
            {PayBox()}
            <Mut>Califica a {D.pd?.display_name}</Mut>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>{[1, 2, 3, 4, 5].map(n => <Chip key={n} t={`${n} ★`} color={C.p} onPress={() => rate(n)} />)}</View>
          </Card>
        )}
        {r && ['accepted', 'arrived', 'ongoing'].includes(r.status) && (
          <Card>
            <Text style={s.h}>{ST[r.status]}</Text>
            {rt.routes[rt.sel] && <Text style={{ fontWeight: '700', color: C.p }}>⏱️ {r.status === 'ongoing' ? 'Llegas' : 'Tu conductor llega'} en ~{mins(rt.routes[rt.sel].duration_traffic_s)} min · {(rt.routes[rt.sel].distance_m / 1000).toFixed(1)} km</Text>}
            <Text style={{ fontWeight: '700' }}>{D.pd?.display_name} ★ {D.pd?.rating_avg} · {veh?.model} · {veh?.plate}</Text>
            <Mut>Tarifa acordada {$c(r.agreed_fare)} · {r.payment_method}</Mut>
            {D.pay?.discount_amount > 0 && <Text style={{ color: C.d, fontWeight: '700' }}>Descuento −{$c(D.pay.discount_amount)} · Pagas {$c(D.pay.amount - D.pay.discount_amount)}</Text>}
            {PayBox()}
            <View style={[s.row, { marginTop: 10 }]}>
              <Btn t="🆘 Emergencia" color={C.red} small onPress={sos} />
              <Btn t="📤 Compartir viaje" ghost small onPress={shareTrip} />
              {r.status === 'accepted' && <Btn t="Cancelar" ghost small onPress={() => cancel(r.id)} />}
            </View>
          </Card>
        )}
        {r && ['accepted', 'arrived', 'ongoing'].includes(r.status) && <Chat rideId={r.id} uid={uid} who={D.pd?.display_name || 'tu conductor'} />}
        <Report uid={uid} rideId={r?.id} />
      </ScrollView>
    </View>
  );
}

// ===== Documentos del conductor (fotos a almacenamiento privado) =====
const DOC_TYPES = { cedula: 'Cédula', licencia: 'Licencia de conducción', soat: 'SOAT', tecnomecanica: 'Tecnomecánica', tarjeta_propiedad: 'Tarjeta de propiedad', foto: 'Foto del conductor' };
function Docs({ drv, docs = [], refresh }) {
  const [sel, setSel] = useState('licencia'), [busy, setBusy] = useState(false);
  const label = { pending: 'Enviado ✔', approved: 'Aprobado ✅', rejected: 'Rechazado ❌' };
  const last = t => [...docs].reverse().find(d => d.doc_type === t);
  const pick = async camera => {
    try {
      const perm = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert('CERQUITA', 'Necesito permiso para usar la cámara o tus fotos.');
      const res = camera ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.6 }) : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.6, mediaTypes: ['images'] });
      if (res.canceled || !res.assets?.[0]?.base64) return;
      setBusy(true);
      const bin = globalThis.atob(res.assets[0].base64), bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const path = `${drv.user_id}/${sel}-${Date.now()}.jpg`;
      const up = await supabase.storage.from('driver-docs').upload(path, bytes.buffer, { contentType: 'image/jpeg' });
      if (up.error) throw up.error;
      if (await m(supabase.from('driver_documents').insert({ driver_id: drv.id, doc_type: sel, storage_path: path }))) Alert.alert('CERQUITA', `${DOC_TYPES[sel]} enviado. Un administrador lo revisará.`);
      refresh();
    } catch (e) { Alert.alert('CERQUITA', e.message || 'No se pudo subir la foto.'); }
    setBusy(false);
  };
  return (
    <Card>
      <Text style={s.h}>Mis documentos</Text>
      {Object.entries(DOC_TYPES).map(([k, l]) => (
        <View key={k} style={[s.row, { paddingVertical: 4 }]}><Text>{l}</Text><Text style={{ color: last(k) ? C.fg : C.mut }}>{last(k) ? label[last(k).status] : 'Falta'}</Text></View>
      ))}
      <Mut>Elige qué documento vas a subir, y toma la foto o elígela de tu galería.</Mut>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        {Object.entries(DOC_TYPES).map(([k, l]) => <Chip key={k} t={l} on={sel === k} color={C.d} onPress={() => setSel(k)} />)}
      </ScrollView>
      {busy ? <ActivityIndicator color={C.d} /> : (
        <View style={s.row}><Btn t="📷 Tomar foto" color={C.d} small onPress={() => pick(true)} /><Btn t="🖼️ Elegir de galería" ghost small onPress={() => pick(false)} /></View>
      )}
    </Card>
  );
}

// ===== Conductor =====
function Wallet({ drv, wallet = [], cfg, refresh }) {
  const [amt, setAmt] = useState(50000), [busy, setBusy] = useState(false), [open, setOpen] = useState(false);
  const low = drv.balance < cfg.min_balance;
  const KIND = { recarga: 'Recarga', recarga_manual: 'Recarga', comision: 'Comisión de viaje', ajuste: 'Ajuste' };
  const sync = async () => {
    setBusy(true);
    try { await supabase.functions.invoke('wompi-sync'); } catch (e) {}
    setBusy(false);
    refresh();
  };
  const recharge = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('wompi-topup', { body: { amount: amt } });
    setBusy(false);
    if (error) {
      let msg = 'No se pudo abrir la recarga. Intenta de nuevo.';
      try { const j = await error.context.json(); if (j?.error) msg = j.error; } catch (e) {}
      return Alert.alert('CERQUITA', msg);
    }
    if (data?.url) Linking.openURL(data.url);
  };
  return (
    <Card>
      <View style={s.row}>
        <View><Mut>Saldo disponible</Mut><Text style={[s.kpi, low && { color: C.red }]}>{$c(drv.balance)}</Text></View>
        <Btn t={open ? 'Cerrar' : 'Recargar'} color={C.d} small onPress={() => setOpen(!open)} />
      </View>
      <Mut>CERQUITA descuenta el {cfg.commission_pct}% de cada carrera de tu saldo.</Mut>
      {low && <Text style={{ color: C.red, marginTop: 6 }}>Necesitas al menos {$c(cfg.min_balance)} para conectarte y recibir viajes. Recarga tu saldo.</Text>}
      {open && (
        <View style={{ marginTop: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[20000, 50000, 100000, 200000].map(v => <Chip key={v} t={$c(v)} on={amt === v} color={C.d} onPress={() => setAmt(v)} />)}
          </ScrollView>
          {busy ? <ActivityIndicator color={C.d} style={{ marginTop: 10 }} /> : <Btn t={`Pagar ${$c(amt)} con Wompi`} color={C.d} onPress={recharge} style={{ marginTop: 10 }} />}
          <Mut>Pagas con tarjeta, PSE o Nequi. El saldo se acredita al confirmar el pago.</Mut>
          <Btn t="🔄 Ya pagué: actualizar saldo" ghost small onPress={sync} style={{ marginTop: 8 }} />
        </View>
      )}
      {wallet.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Mut>Últimos movimientos</Mut>
          {wallet.map((w, i) => (
            <View key={i} style={[s.row, { paddingVertical: 3 }]}>
              <Text style={{ flex: 1, color: C.fg }}>{KIND[w.kind] || w.kind}</Text>
              <Text style={{ fontWeight: '700', color: w.amount < 0 ? C.red : C.d }}>{w.amount < 0 ? '−' : '+'}{$c(Math.abs(w.amount))}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

function PickupInfo({ r }) {
  const [url, setUrl] = useState(null);
  if (!r.pickup_note && !r.pickup_photo_path) return null;
  const show = async () => {
    const { data, error } = await supabase.storage.from('ride-photos').createSignedUrl(r.pickup_photo_path, 300);
    if (error) return Alert.alert('CERQUITA', 'No se pudo cargar la foto.');
    setUrl(data.signedUrl);
  };
  return (
    <View style={{ marginTop: 6 }}>
      {r.pickup_note ? <Text style={{ color: C.fg }}>📌 Referencia: {r.pickup_note}</Text> : null}
      {r.pickup_photo_path && !url ? <Btn t="📷 Ver foto de la entrada" ghost small onPress={show} style={{ marginTop: 6 }} /> : null}
      {url ? <Image source={{ uri: url }} style={{ height: 200, borderRadius: 10, marginTop: 6 }} resizeMode="cover" /> : null}
    </View>
  );
}

function Req({ r, mine, pos, onOffer, onHide }) {
  const [v, setV] = useState('');
  return (
    <Card>
      <View style={s.row}><Text style={{ fontWeight: '700', flex: 1 }}>{r.origin_name} → {r.dest_name}</Text><Text style={{ fontWeight: '800' }}>{$c(r.offered_fare)}</Text></View>
      <Mut>{r.distance_km} km · ~{r.est_minutes} min · Referencia {$c(r.reference_fare)}</Mut>
      {pos && <Mut>📍 El pasajero está a {(hav(pos, { lat: r.origin_lat, lng: r.origin_lng }) * 1.3).toFixed(1)} km de ti · llegas en ~{Math.max(1, Math.ceil(hav(pos, { lat: r.origin_lat, lng: r.origin_lng }) * 1.3 / 24 * 60))} min</Mut>}
      <PickupInfo r={r} />
      {mine ? <Mut>Oferta enviada por {$c(mine.price)}. Esperando al pasajero…</Mut> : (
        <View style={{ marginTop: 8 }}>
          <Btn t={`Aceptar ${$c(r.offered_fare)}`} color={C.d} small onPress={() => onOffer(r.id, r.offered_fare)} />
          <View style={[s.row, { marginTop: 8 }]}>
            <Input style={{ flex: 1, marginBottom: 0 }} placeholder="Contraoferta" keyboardType="numeric" value={v} onChangeText={setV} />
            <Btn t="Contraofertar" ghost small onPress={() => onOffer(r.id, +v)} />
            <Btn t="Rechazar" ghost small onPress={() => onHide(r.id)} />
          </View>
        </View>
      )}
    </Card>
  );
}

function Driver({ uid, cfg, cats, D, refresh }) {
  const drv = D.drv;
  const [f, setF] = useState({ name: '', cat: 'carro', model: '', plate: '', color: '' }), [hid, setHid] = useState([]), [pos, setPos] = useState(null);
  useEffect(() => {
    if (!drv?.online) return;
    let sub, alive = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || !alive) return;
      const save = c => { setPos({ lat: c.latitude, lng: c.longitude }); return m(supabase.from('driver_locations').upsert({ driver_id: drv.id, lat: c.latitude, lng: c.longitude, heading: c.heading, updated_at: new Date().toISOString() })); };
      try { await save((await Location.getCurrentPositionAsync({})).coords); } catch (e) { Alert.alert('CERQUITA', 'Activa el GPS para recibir solicitudes cercanas.'); }
      if (!alive) return;
      sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 0, timeInterval: D.cur ? 3000 : 10000 }, l => save(l.coords));
    })();
    return () => { alive = false; sub?.remove(); };
  }, [drv?.online, drv?.id, !!D.cur]);

  // Segundo plano: la ubicación sigue enviándose con la app minimizada (con aviso fijo en la barra)
  useEffect(() => {
    if (!drv) return;
    (async () => {
      try {
        if (drv.online) {
          await AsyncStorage.setItem('cq_driver_id', drv.id);
          const fg = await Location.requestForegroundPermissionsAsync();
          if (fg.status !== 'granted') return;
          const bg = await Location.requestBackgroundPermissionsAsync();
          if (bg.status !== 'granted') return Alert.alert('CERQUITA', 'Para recibir solicitudes con la app minimizada, entra a Ajustes → Aplicaciones → CERQUITA → Ubicación y elige "Permitir todo el tiempo".');
          if (!(await Location.hasStartedLocationUpdatesAsync(BG_TASK))) {
            await Location.startLocationUpdatesAsync(BG_TASK, { accuracy: Location.Accuracy.Balanced, timeInterval: 8000, distanceInterval: 0, pausesUpdatesAutomatically: false, foregroundService: { notificationTitle: 'CERQUITA en línea', notificationBody: 'Recibiendo solicitudes de viaje cercanas', notificationColor: '#1769ff' } });
          }
        } else {
          await AsyncStorage.removeItem('cq_driver_id');
          if (await Location.hasStartedLocationUpdatesAsync(BG_TASK)) await Location.stopLocationUpdatesAsync(BG_TASK);
        }
      } catch (e) { console.log('bg:', e?.message); }
    })();
  }, [drv?.online, drv?.id]);

  // Aviso con vibración cuando llega una solicitud nueva cercana (el sonido en segundo plano lo da la notificación push)
  const seen = useRef(null);
  const idsKey = (D.req || []).filter(x => !hid.includes(x.id)).map(x => x.id).join(',');
  useEffect(() => {
    if (!drv?.online) { seen.current = null; return; }
    (async () => {
      try {
        await Notifications.requestPermissionsAsync();
        if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('solicitudes', { name: 'Solicitudes de viaje', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 500, 300, 500], sound: 'default' });
      } catch (e) {}
    })();
  }, [drv?.online]);
  useEffect(() => {
    if (!drv?.online) return;
    const cur = (D.req || []).filter(x => !hid.includes(x.id));
    if (seen.current === null) seen.current = new Set();
    const fresh = cur.filter(x => !seen.current.has(x.id));
    cur.forEach(x => seen.current.add(x.id));
    if (!fresh.length) return;
    Vibration.vibrate([0, 600, 300, 600, 300, 600]);
  }, [idsKey, drv?.online]);

  const register = async () => {
    if (!f.name.trim() || !f.model.trim() || !f.plate.trim()) return Alert.alert('CERQUITA', 'Completa nombre, vehículo y placa.');
    const d = await q(supabase.from('drivers').insert({ user_id: uid, display_name: f.name.trim(), category: f.cat }).select().single());
    if (!d) return Alert.alert('CERQUITA', 'No se pudo registrar. Intenta de nuevo.');
    if (await m(supabase.from('vehicles').insert({ driver_id: d.id, model: f.model.trim(), plate: f.plate.trim().toUpperCase(), color: f.color || null }))) Alert.alert('CERQUITA', 'Registro enviado. Un administrador debe aprobarte.');
    refresh();
  };
  const online = async () => { if (await m(supabase.from('drivers').update({ online: !drv.online }).eq('id', drv.id))) refresh(); };
  const offer = async (rid, p) => { if (await m(supabase.from('offers').insert({ ride_id: rid, driver_id: drv.id, price: Math.round(p / 100) * 100, eta_minutes: 5 }))) refresh(); };
  const next = async id => { const { error } = await supabase.rpc('advance_ride', { p_ride: id }); if (error) Alert.alert('CERQUITA', error.message); refresh(); };

  if (!drv) return (
    <ScrollView contentContainerStyle={{ padding: 12 }} keyboardShouldPersistTaps="handled">
      <Card>
        <Text style={s.h}>Registrarme como conductor</Text>
        <Input placeholder="Nombre completo" value={f.name} onChangeText={v => setF({ ...f, name: v })} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>{Object.values(cats).map(x => <Chip key={x.code} t={x.name.replace('CERQUITA ', '')} on={f.cat === x.code} color={C.d} onPress={() => setF({ ...f, cat: x.code })} />)}</ScrollView>
        <Input placeholder="Vehículo (marca y modelo)" value={f.model} onChangeText={v => setF({ ...f, model: v })} />
        <Input placeholder="Placa" autoCapitalize="characters" value={f.plate} onChangeText={v => setF({ ...f, plate: v })} />
        <Input placeholder="Color" value={f.color} onChangeText={v => setF({ ...f, color: v })} />
        <Btn t="Enviar registro" color={C.d} onPress={register} />
        <Mut>Después de enviar el registro podrás subir las fotos de tus documentos aquí mismo.</Mut>
      </Card>
    </ScrollView>
  );
  if (drv.status !== 'approved') return <ScrollView contentContainerStyle={{ padding: 12 }}><Card><Text style={s.h}>{drv.display_name}</Text><Text>Estado de tu cuenta: {{ pending: 'pendiente de aprobación', rejected: 'rechazada', suspended: 'suspendida' }[drv.status]}. Un administrador debe revisar tus documentos.</Text></Card>{drv.status === 'pending' && <Docs drv={drv} docs={D.docs} refresh={refresh} />}</ScrollView>;

  const gross = D.dh.reduce((a, x) => a + x.amount, 0), net = gross - D.dh.reduce((a, x) => a + x.commission_amount, 0), v = drv.vehicles?.[0], cur = D.cur;
  if (cur) return <DriverTrip cur={cur} pos={pos} next={next} uid={uid} />;
  const list = D.req.filter(x => !hid.includes(x.id));
  return (
    <View style={{ flex: 1 }}>
      {cur && (
        <MapView style={{ height: 240 }} showsUserLocation initialRegion={{ latitude: cur.origin_lat, longitude: cur.origin_lng, latitudeDelta: .05, longitudeDelta: .05 }}>
          <Marker coordinate={{ latitude: cur.origin_lat, longitude: cur.origin_lng }} pinColor="green" title="Recoger" />
          <Marker coordinate={{ latitude: cur.dest_lat, longitude: cur.dest_lng }} pinColor="red" title="Destino" />
          <Polyline coordinates={[{ latitude: cur.origin_lat, longitude: cur.origin_lng }, { latitude: cur.dest_lat, longitude: cur.dest_lng }]} strokeColor={C.d} strokeWidth={3} />
        </MapView>
      )}
      <ScrollView contentContainerStyle={{ padding: 12 }} keyboardShouldPersistTaps="handled">
        <View style={s.row}>
          <Card><Mut>Ganancias netas</Mut><Text style={s.kpi}>{$c(net)}</Text></Card>
          <Card><Mut>Servicios</Mut><Text style={s.kpi}>{D.dh.length}</Text></Card>
          <Card><Mut>Calificación</Mut><Text style={s.kpi}>★ {drv.rating_avg}</Text></Card>
        </View>
        <Wallet drv={drv} wallet={D.wallet} cfg={cfg} refresh={refresh} />
        <Card>
          <Text style={{ fontWeight: '700' }}>{v?.model} · {v?.plate} · {cats[drv.category]?.name}</Text>
          <Mut>{D.plan ? `Plan ${D.plan.plans?.name} · comisión ${D.plan.plans?.commission_pct}% · vence ${new Date(D.plan.ends_at).toLocaleDateString('es-CO')}` : `Comisión general ${cfg.commission_pct}%`}</Mut>
          <Btn t={drv.online ? 'Desconectarme' : 'Conectarme'} color={drv.online ? C.red : C.d} onPress={online} style={{ marginTop: 8 }} />
        </Card>
        {cur ? (
          <Card>
            <Text style={s.h}>{ST[cur.status]}</Text>
            <Text>{cur.passenger_name} · {cur.origin_name} → {cur.dest_name} · {cur.distance_km} km</Text>
            <Text style={{ color: C.d, fontWeight: '700' }}>💵 Cobra al pasajero {$c(cur.agreed_fare - ([].concat(cur.payments || [])[0]?.discount_amount || 0))} ({cur.payment_method})</Text>
            <PickupInfo r={cur} />
            <Mut>Tarifa acordada {$c(cur.agreed_fare)} (neto {$c(cur.agreed_fare - ([].concat(cur.payments || [])[0]?.commission_amount ?? 0))}) · {cur.payment_method}</Mut>
            {([].concat(cur.payments || [])[0]?.discount_amount || 0) > 0 && <Text style={{ color: C.d, marginTop: 6 }}>El pasajero usó un descuento y paga {$c(cur.agreed_fare - [].concat(cur.payments)[0].discount_amount)}. Tus ganancias no cambian: CERQUITA asume el descuento.</Text>}
            <Btn t={{ accepted: 'Confirmar llegada', arrived: 'Iniciar viaje', ongoing: 'Finalizar viaje' }[cur.status]} color={C.d} onPress={() => next(cur.id)} style={{ marginTop: 10 }} />
          </Card>
        ) : !drv.online ? <Mut>Conéctate para recibir solicitudes cercanas.</Mut> : (
          <>
            {list.length === 0 && <Mut>Sin solicitudes cercanas por ahora ({cfg.search_radius_km} km a la redonda). Solo recibes solicitudes de {cats[drv.category]?.name}. Se actualizan en tiempo real.</Mut>}
            {list.map(x => <Req key={x.id} r={x} pos={pos} mine={D.mo.find(o => o.ride_id === x.id)} onOffer={offer} onHide={id => setHid([...hid, id])} />)}
          </>
        )}
        {cur && <Chat rideId={cur.id} uid={uid} who={cur.passenger_name || 'el pasajero'} />}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 50 },
  top: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 8 },
  logo: { fontWeight: '800', fontSize: 18, color: C.p, marginRight: 'auto' },
  card: { backgroundColor: C.card, borderColor: C.br, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  h: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: C.fg },
  btn: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  chip: { borderWidth: 1, borderColor: C.br, backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 6 },
  input: { borderWidth: 1, borderColor: C.br, backgroundColor: C.bg, borderRadius: 10, padding: 10, marginBottom: 10, color: C.fg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  price: { fontSize: 28, fontWeight: '800', color: C.fg },
  kpi: { fontSize: 18, fontWeight: '800', color: C.fg },
  offer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.br },
});
