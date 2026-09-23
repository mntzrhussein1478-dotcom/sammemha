function escapeWifi(value:string){return value.replace(/([\\;,:"'])/g,'\\$1')}
export function qrPayload(data:Record<string,string>){
  const kind=data.kind||'url';
  switch(kind){
    case 'phone': return `tel:${(data.phone||'').trim()}`;
    case 'whatsapp': return `https://wa.me/${(data.whatsapp||'').replace(/\D/g,'')}`;
    case 'email': return `mailto:${(data.email||'').trim()}`;
    case 'wifi': {
      const security=data.wifiSecurity||'WPA';
      const ssid=escapeWifi((data.wifiSsid||'').trim());
      const password=escapeWifi(data.wifiPassword||'');
      return `WIFI:T:${security};S:${ssid};P:${password};;`;
    }
    case 'text': return data.text||'';
    default: return (data.url||'').trim();
  }
}
export function hasQrPayload(data:Record<string,string>){return qrPayload(data).trim().length>0}
