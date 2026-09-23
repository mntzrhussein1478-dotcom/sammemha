export const features={premium:false,accounts:false,feedbackCopy:true,admin:false,analytics:true,newTemplates:true} as const;
export type FeatureName=keyof typeof features;
export function featureEnabled(name:FeatureName){return features[name]}
