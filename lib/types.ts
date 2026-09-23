export type ToolSlug='notebook-cover'|'certificate'|'schedule'|'business-card'|'qr'|'cv'|'invitation';
export type FieldType='text'|'textarea'|'date'|'time'|'email'|'tel'|'url'|'color'|'select'|'image'|'range'|'checkbox';
export type AccessTier='free'|'premium';
export type ToolBadge='شائع'|'جديد';
export type TemplatePattern='minimal'|'kids'|'education'|'games'|'cars'|'space'|'nature'|'sport'|'geometric'|'boys'|'girls'|'formal'|'modern'|'classic'|'soft'|'bold';

export interface ConditionalField { key:string; value:string }
export interface SelectOption { label:string; value:string }
export interface ToolField {
  key:string;
  label:string;
  type:FieldType;
  placeholder?:string;
  helper?:string;
  required?:boolean;
  options?:SelectOption[];
  maxLength?:number;
  min?:number;
  max?:number;
  step?:number;
  showWhen?:ConditionalField;
}
export interface TemplateDefinition {
  id:string;
  name:string;
  category:string;
  version:number;
  access:AccessTier;
  accent:string;
  background:string;
  pattern:TemplatePattern;
}
export interface ExportSettings {
  dpi:number;
  bleedMm:number;
  safeMm:number;
  allowTransparent:boolean;
}
export interface ToolDefinition {
  slug:ToolSlug;
  name:string;
  description:string;
  category:string;
  access:AccessTier;
  badge?:ToolBadge;
  sortWeight:number;
  dimensions:{widthMm:number;heightMm:number};
  exportSettings:ExportSettings;
  fields:ToolField[];
  defaults:Record<string,string>;
  templates:TemplateDefinition[];
  defaultTemplateId:string;
  benefits:string[];
  faq:{q:string;a:string}[];
  related:ToolSlug[];
}
export interface ImageTransform { zoom:number; rotate:number; x:number; y:number }
export interface DraftStyle { accent:string; background:string; fontScale:number; fontFamily:'sans'|'serif'; templateId:string; includeBleed:boolean }
export interface DesignDraft {
  schemaVersion:1;
  slug:ToolSlug;
  templateVersion:number;
  updatedAt:number;
  data:Record<string,string>;
  style:DraftStyle;
  imageUrls:Record<string,string>;
  imageTransforms:Record<string,ImageTransform>;
}
export interface RecentDesign {
  slug:ToolSlug;
  title:string;
  templateId:string;
  updatedAt:number;
}
