import {describe,expect,it} from 'vitest';
import {qrPayload} from '@/lib/qr';
describe('qrPayload',()=>{
  it('creates whatsapp link',()=>expect(qrPayload({kind:'whatsapp',whatsapp:'+964 770 123 4567'})).toBe('https://wa.me/9647701234567'));
  it('creates wifi payload',()=>expect(qrPayload({kind:'wifi',wifiSsid:'Home',wifiPassword:'secret',wifiSecurity:'WPA'})).toBe('WIFI:T:WPA;S:Home;P:secret;;'));
  it('escapes wifi separators',()=>expect(qrPayload({kind:'wifi',wifiSsid:'Home;5G',wifiPassword:'a:b',wifiSecurity:'WPA'})).toBe('WIFI:T:WPA;S:Home\\;5G;P:a\\:b;;'));
  it('creates email payload',()=>expect(qrPayload({kind:'email',email:'hello@example.com'})).toBe('mailto:hello@example.com'));
});
