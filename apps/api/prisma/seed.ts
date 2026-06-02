import '../src/env.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const HIGH_CONCURRENCY_CACHE_QUESTION = 'If you were truly designing a cache for a high-concurrency environment that demands both fast lookups and efficient range queries, how would you address the limitations of each? Simply stating the trade-offs is not sufficient for a production-grade system. Would you consider a composite data structure? Perhaps a multi-layered caching strategy? Walk me through a concrete architectural approach that mitigates these individual weaknesses while satisfying both requirements. Think about how you would handle synchronization and data consistency.';
async function main() {
  const company = await prisma.company.upsert({where:{slug:'demo-consulting'}, update:{}, create:{name:'Demo Consulting Group', slug:'demo-consulting', description:'A strategy and operations firm hiring for client-facing problem solvers.', reportEmail:'hr@example.com', primaryColor:'#0e7490'}});
  const role = await prisma.jobRole.create({data:{companyId:company.id,title:'Associate Consultant',roleType:'CONSULTING',description:'Entry-level consulting role across strategy and operations.',requirements:'Structured thinking, client communication, analytics, business judgment.',primaryCriteria:['problem-solving','client skills','structured thinking'],secondaryCriteria:['industry knowledge','analytics','presentation'],atsScoringWeights:{primary:0.4,secondary:0.3,education:0.1,experience:0.1,communication:0.1},evaluationCriteria:{answerDepth:1,confidence:1,communication:1,domainKnowledge:1,problemSolving:1}}});
  await prisma.question.createMany({data:[
    {companyId:company.id,jobRoleId:role.id,text:'Tell me about a time you solved an ambiguous business problem.',roleApplicability:['CONSULTING'],difficulty:'MEDIUM',topicCategories:['problem solving','ambiguity'],aiEvaluationGuidance:'Look for structure, hypotheses, analysis, and business impact.'},
    {companyId:company.id,jobRoleId:role.id,text:'A client is losing market share despite increasing marketing spend. How would you approach this?',roleApplicability:['CONSULTING'],difficulty:'HARD',topicCategories:['case','strategy'],aiEvaluationGuidance:'Look for issue tree, market/customer/channel analysis, and prioritization.'},
    {companyId:company.id,jobRoleId:role.id,text:HIGH_CONCURRENCY_CACHE_QUESTION,roleApplicability:['CONSULTING'],difficulty:'HARD',topicCategories:['system design','caching','concurrency','data consistency'],estimatedMinutes:8,aiEvaluationGuidance:'Look for a concrete architecture that combines key-value lookup with an ordered index, explains range-query mechanics, uses sharding or partitioning for high concurrency, and covers synchronization, invalidation, consistency model, write path, and failure handling.'}
  ]});
  const candidate = await prisma.candidate.create({data:{companyId:company.id,fullName:'Aarav Sharma',email:'aarav@example.com',parsedResume:{yearsOfExperience:2, skills:['analytics','presentation','client communication','problem-solving']},atsScore:82,atsBreakdown:{demo:true}}});
  await prisma.interviewSession.create({data:{companyId:company.id,candidateId:candidate.id,jobRoleId:role.id,status:'SCHEDULED',scheduledAt:new Date()}});
  console.log({companyId: company.id, roleId: role.id});
}
main().finally(() => prisma.$disconnect());
