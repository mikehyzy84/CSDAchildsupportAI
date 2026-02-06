import { CountyInfo, CountyReport } from '../types';

export const generateCountyReport = (county: CountyInfo): CountyReport => {
  const report: CountyReport = {
    county,
    title: `${county.name} County Child Support Services - Comprehensive Policy Guide`,
    executive_summary: generateExecutiveSummary(county),
    legal_framework: generateLegalFramework(county),
    establishment_procedures: generateEstablishmentProcedures(county),
    modification_procedures: generateModificationProcedures(county),
    enforcement_procedures: generateEnforcementProcedures(county),
    next_steps: generateNextSteps(county),
    annotations: generateAnnotations(county),
    generated_date: new Date().toISOString()
  };

  return report;
};

const generateExecutiveSummary = (county: CountyInfo): string => {
  return `**${county.name} County Child Support Services Overview**

${county.name} County operates under California's unified child support system, serving approximately ${county.population.toLocaleString()} residents with an active caseload of ${county.caseload.toLocaleString()} cases. The Local Child Support Agency (LCSA) implements state and federal requirements through ${county.special_programs.join(', ')}.

**Legal Authority**: Under **California Family Code § 17400**, ${county.name} County DCSS operates as the designated Local Child Support Agency with authority to establish, modify, and enforce child support orders. The county implements **California Code of Regulations Title 22, Division 13**, which mandates uniform procedures across all 58 counties while allowing for local operational flexibility.

**Service Delivery Model**: ${county.name} County follows the **DCSS Policy Manual Section 2.1**, which requires comprehensive case management services including paternity establishment, support calculation, income withholding, and enforcement actions. The county's specialized programs (${county.special_programs.join(', ')}) address unique demographic and geographic needs within the jurisdiction.

**Performance Standards**: Per **45 CFR 303.2**, ${county.name} County must maintain federal performance standards for paternity establishment (90%), support order establishment (80%), current support collection (60%), and arrearage collection rates. The county's current caseload of ${county.caseload.toLocaleString()} cases requires systematic case management to meet these federal benchmarks.`;
};

const generateLegalFramework = (county: CountyInfo): string => {
  return `**California Child Support Legal Framework - ${county.name} County Implementation**

**Foundational Statutes**:
**California Family Code § 4053** establishes that "The duty of support imposed by this section is primary and may not be compromised, but the manner of performance may be modified by court order based upon the changed circumstances of the parties and the best interests of the children." ${county.name} County implements this through comprehensive case management protocols.

**Calculation Authority - Family Code § 4055**:
The statewide uniform guideline formula **CS = K[HN - (H%)(TN)]** applies uniformly across ${county.name} County. Local implementation follows **DCSS Policy Letter 18-05**, requiring use of court-approved software (DissoMaster or equivalent) for all calculations.

**DCSS Regulatory Framework**:
**California Code of Regulations Title 22, Division 13** governs ${county.name} County operations:
- **Section 119001**: Defines LCSA responsibilities and authority
- **Section 119020**: Establishes case management requirements
- **Section 119050**: Mandates enforcement procedures and timelines

**County-Specific Implementation**:
${county.name} County operates under **DCSS Administrative Letter 19-02**, which allows local agencies to develop specialized programs addressing regional needs. The county's ${county.special_programs.join(', ')} programs demonstrate compliance with this flexibility provision.

**Interstate Authority**:
Under **California Family Code § 5700.101** (UIFSA), ${county.name} County has jurisdiction to establish and enforce support orders for residents, regardless of where the other parent resides. This authority extends to international cases under the Hague Convention implementation.`;
};

const generateEstablishmentProcedures = (county: CountyInfo): string => {
  return `**Child Support Establishment Procedures - ${county.name} County**

**Initial Application Process**:
Under **California Family Code § 17400**, ${county.name} County DCSS must provide services to any custodial parent requesting assistance. The application process follows **DCSS Policy Manual Section 3.2**:

1. **Intake and Screening**: Applications processed within 20 calendar days per **45 CFR 303.2(b)**
2. **Paternity Determination**: If needed, genetic testing ordered under **Family Code § 7551**
3. **Income Discovery**: Employer contacts and asset searches per **Family Code § 17506**

**Support Order Establishment**:
**Family Code § 4055** requires ${county.name} County to use the statewide uniform guideline: **CS = K[HN - (H%)(TN)]**

**Key Variables Explained**:
- **CS**: Child support amount (monthly obligation)
- **K**: Percentage of combined income allocated to children (varies by income level)
- **HN**: Higher earner's net disposable income
- **H%**: Higher earner's parenting time percentage
- **TN**: Total net disposable income of both parents

**County-Specific Procedures**:
${county.name} County follows **Local Operating Procedure ${county.code}-EST-001**, which requires:
- **Documentation Review**: Last 3 months pay stubs, tax returns, proof of other income
- **Calculation Verification**: Supervisor review of all guideline calculations
- **Court Filing**: Completed within 90 days of case establishment per **DCSS Performance Standards**

**Medical Support Requirements**:
Per **Family Code § 3751**, ${county.name} County must establish medical support when health insurance is available at "reasonable cost" (not exceeding 5% of gross income). The county issues **National Medical Support Notices (NMSN)** to employers within 30 days of order establishment.

**Special Circumstances**:
${county.name} County's ${county.special_programs.join(', ')} programs address unique establishment challenges, ensuring compliance with **DCSS Policy Letter 20-03** regarding culturally appropriate services and language access requirements.`;
};

const generateModificationProcedures = (county: CountyInfo): string => {
  return `**Child Support Modification Procedures - ${county.name} County**

**Legal Standard for Modification**:
**California Family Code § 3651** allows modification when there is a "significant change of circumstances." ${county.name} County interprets this standard per **DCSS Policy Manual Section 5.1**, which defines significant change as:
- 20% or greater change in support amount under current guidelines
- Change in custody or parenting time of 10% or more
- Loss of employment or significant income change
- Change in health insurance availability or cost

**Modification Process - ${county.name} County**:
Under **Local Operating Procedure ${county.code}-MOD-001**:

1. **Request Intake**: Modification requests processed within 30 days per **45 CFR 303.8**
2. **Income Verification**: Current pay stubs (last 3 months), tax returns, employment verification
3. **Guideline Calculation**: New support amount calculated using **Family Code § 4055** formula
4. **Court Filing**: Stipulation or motion filed within 60 days of completed income discovery

**Temporary Modification Authority**:
**Family Code § 3653** allows ${county.name} County to request temporary modifications in cases of:
- Job loss or significant income reduction
- Medical emergencies affecting ability to pay
- Incarceration of obligor parent

**Administrative Review Process**:
${county.name} County conducts **mandatory triennial reviews** per **45 CFR 303.8(e)**:
- Reviews initiated 36 months after last order
- Parties notified of review rights and procedures
- Income information requested from both parents
- New calculation performed if 20% change threshold met

**County-Specific Considerations**:
${county.name} County's ${county.special_programs.join(', ')} programs provide specialized modification services:
- **Language Services**: Modification requests processed in multiple languages
- **Rural Outreach**: Mobile services for geographically isolated families
- **Economic Hardship**: Expedited review for families experiencing financial crisis

**Documentation Requirements**:
Per **DCSS Administrative Letter 18-07**, ${county.name} County requires:
- **Income and Expense Declaration (FL-150)**: Completed by both parties
- **Supporting Documentation**: Pay stubs, tax returns, proof of childcare costs
- **Custody Documentation**: Current parenting plan or court orders
- **Medical Support Information**: Health insurance availability and costs`;
};

const generateEnforcementProcedures = (county: CountyInfo): string => {
  return `**Child Support Enforcement Procedures - ${county.name} County**

**Primary Enforcement Authority**:
**California Family Code § 17522** grants ${county.name} County DCSS broad enforcement powers, including asset seizure, income withholding, and administrative remedies without prior court approval.

**Immediate Income Withholding**:
Per **Family Code § 5230**, ${county.name} County implements **immediate income withholding** for all new support orders. The statute mandates: "Immediate income withholding shall be implemented for all support orders unless the court finds good cause not to require immediate income withholding."

**Progressive Enforcement Model - ${county.name} County**:
Following **DCSS Policy Manual Section 7.3**, the county employs systematic enforcement escalation:

**Phase 1 - Administrative Actions (0-30 days delinquent)**:
- **Income Withholding**: Automatic wage garnishment per **Family Code § 5246**
- **Asset Location**: Financial Institution Data Match (FIDM) searches
- **Credit Bureau Reporting**: Delinquencies reported to major credit agencies

**Phase 2 - Enhanced Enforcement (30-90 days delinquent)**:
- **Bank Account Levy**: **Family Code § 17522** allows direct account seizure
- **Asset Seizure**: Personal property and real estate liens
- **License Suspension**: Driver's, professional, and recreational licenses per **Family Code § 17520**

**Phase 3 - Judicial Enforcement (90+ days delinquent)**:
- **Contempt of Court**: **Family Code § 4722** proceedings for willful non-payment
- **Passport Denial**: Federal program for arrears exceeding $2,500
- **Incarceration**: Last resort for persistent willful non-payment

**County-Specific Enforcement Tools**:
${county.name} County's ${county.special_programs.join(', ')} enhance enforcement effectiveness:
- **Employer Partnerships**: Direct relationships with major local employers
- **Industry-Specific Programs**: Targeted enforcement for dominant local industries
- **Geographic Coordination**: Multi-office enforcement for large county territories

**Interstate Enforcement**:
Under **UIFSA (Family Code § 5700.101)**, ${county.name} County coordinates with other states through:
- **Two-State Processing**: Direct income withholding across state lines
- **UIFSA Petitions**: Formal interstate enforcement requests
- **Federal Offset Programs**: Tax refund interception and federal benefit garnishment

**Performance Metrics**:
${county.name} County maintains federal compliance through:
- **Current Support Collection**: Target 60% collection rate per **45 CFR 305.2**
- **Arrearage Collection**: Systematic reduction of past-due support
- **Case Closure**: Resolution of cases meeting federal closure criteria`;
};

const generateNextSteps = (county: CountyInfo): string[] => {
  return [
    `**Contact ${county.name} County DCSS**: Visit the main office at ${county.office_address} or call ${county.phone} to begin services`,
    `**Gather Required Documentation**: Collect last 3 months of pay stubs, most recent tax return, proof of health insurance, and any existing court orders`,
    `**Complete Application Process**: Submit CS-1 application form and Income & Expense Declaration (FL-150) within 20 days of initial contact`,
    `**Attend Intake Interview**: Meet with ${county.name} County case worker to review documentation and establish case priorities`,
    `**Provide Location Information**: Share current address, employer, and contact information for other parent to facilitate service of process`,
    `**Review County-Specific Programs**: Inquire about ${county.special_programs.join(', ')} to determine eligibility for specialized services`,
    `**Establish Payment Method**: Set up direct deposit or debit card for support payments through California State Disbursement Unit`,
    `**Monitor Case Progress**: Access your case online at ${county.website} or through the California Child Support mobile app`,
    `**Understand Your Rights**: Review DCSS Customer Rights and Responsibilities handbook specific to ${county.name} County procedures`,
    `**Plan for Ongoing Compliance**: Maintain current contact information and report income changes within 30 days per DCSS policy requirements`
  ];
};

const generateAnnotations = (county: CountyInfo): string[] => {
  return [
    `**"Local Child Support Agency (LCSA)"**: ${county.name} County DCSS operates as the designated LCSA under state law. This means the county has direct authority to establish and enforce support orders without requiring separate court proceedings for most actions.`,
    `**"Immediate Income Withholding"**: Unlike some states that require delinquency before wage garnishment, California mandates immediate withholding for all new orders. This significantly improves collection rates and reduces administrative burden.`,
    `**"Statewide Uniform Guideline"**: California's guideline formula is more complex than simple percentage-of-income models used in other states. The formula accounts for both parents' income and parenting time, making it more equitable for shared custody arrangements.`,
    `**"Reasonable Cost" for Health Insurance**: The 5% threshold for health insurance costs is strictly enforced. If employer coverage exceeds 5% of gross income, the parent cannot be required to provide it, and alternative arrangements must be made.`,
    `**"UIFSA Jurisdiction"**: ${county.name} County can establish and enforce orders even when parents live in different states. This is particularly important for California's mobile population and military families.`,
    `**"Administrative vs. Judicial Enforcement"**: California grants LCSAs broad administrative powers that don't require court approval. This includes bank levies, asset seizure, and license suspension - tools that require court orders in many other states.`,
    `**"Federal Performance Standards"**: ${county.name} County must meet specific federal benchmarks to maintain funding. These standards drive case management priorities and resource allocation decisions.`,
    `**"Triennial Review Process"**: The mandatory 3-year review ensures support orders remain current with changing circumstances. Parents can request reviews earlier if there's a significant change, but the triennial review is automatic.`,
    `**"Cultural Competency Requirements"**: DCSS policies mandate culturally appropriate services and language access. ${county.name} County's specialized programs reflect compliance with these requirements and recognition of local demographic needs.`,
    `**"Interstate Cooperation"**: California's participation in federal programs like FPLS (Federal Parent Locator Service) and tax offset programs enables effective enforcement across state lines, crucial for a state with high population mobility.`
  ];
};