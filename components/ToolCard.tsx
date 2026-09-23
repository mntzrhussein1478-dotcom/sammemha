import Link from 'next/link';
import type {ToolDefinition} from '@/lib/types';
const icons:Record<string,string>={'notebook-cover':'▤',certificate:'✦',schedule:'▦','business-card':'▭',qr:'▩',cv:'☷',invitation:'✉'};
export default function ToolCard({tool}:{tool:ToolDefinition}){return <Link className="tool-card" href={`/tools/${tool.slug}`}><div className="tool-icon" aria-hidden="true">{icons[tool.slug]}</div><div className="tool-meta"><div className="row"><h3>{tool.name}</h3>{tool.badge&&<span className="badge">{tool.badge}</span>}<span className="badge free">مجاني</span></div><p>{tool.description}</p><div className="tool-card-foot"><span>{tool.templates.length} {tool.templates.length===1?'قالب':'قوالب'}</span><span className="text-link">ابدأ التصميم ←</span></div></div></Link>}
