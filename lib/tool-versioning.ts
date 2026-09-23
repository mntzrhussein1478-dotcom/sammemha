import type {DesignDraft,ToolDefinition} from '@/lib/types';
export function migrateDraft(draft:DesignDraft,tool:ToolDefinition):DesignDraft{
  const template=tool.templates.find(t=>t.id===draft.style.templateId)??tool.templates.find(t=>t.id===tool.defaultTemplateId)??tool.templates[0];
  return {...draft,data:{...tool.defaults,...draft.data},style:{accent:draft.style.accent||template.accent,background:draft.style.background||template.background,fontScale:draft.style.fontScale||1,fontFamily:draft.style.fontFamily||'sans',templateId:template.id,includeBleed:Boolean(draft.style.includeBleed)},templateVersion:template.version};
}
