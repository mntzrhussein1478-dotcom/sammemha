import {describe,expect,it} from 'vitest';import {safeFileName} from '@/lib/export';
describe('safeFileName',()=>{it('cleans unsafe characters',()=>expect(safeFileName(' شهادة: أحمد / 2026 ')).toBe('شهادة-أحمد-2026'));it('uses fallback',()=>expect(safeFileName('***','design')).toBe('design'))});
