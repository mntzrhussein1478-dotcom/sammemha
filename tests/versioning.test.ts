import {describe,expect,it} from 'vitest';
import {migrateDraft} from '@/lib/tool-versioning';
import {toolsBySlug} from '@/data/tools';
describe('template versioning',()=>{it('falls back to the default template when an old template no longer exists',()=>{const tool=toolsBySlug.certificate;const draft={schemaVersion:1 as const,slug:'certificate' as const,templateVersion:1,updatedAt:1,data:{recipient:'منتظر'},style:{accent:'#000000',background:'#ffffff',fontScale:1,fontFamily:'sans' as const,templateId:'removed-template',includeBleed:false},imageUrls:{},imageTransforms:{}};const migrated=migrateDraft(draft,tool);expect(migrated.style.templateId).toBe(tool.defaultTemplateId);expect(migrated.data.recipient).toBe('منتظر')})});
