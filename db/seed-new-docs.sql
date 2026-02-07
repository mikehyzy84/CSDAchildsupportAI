-- SQL seed file for PDF documents
-- Generated: 2026-02-07
-- Documents: Policy_Sample.pdf, Procedure_Sample1.pdf, Procedure_Sample2.pdf

-- ============================================================================
-- DOCUMENT 1: Policy_Sample.pdf
-- Source: county_policy (Fresno County)
-- ============================================================================

INSERT INTO documents (id, title, source, source_url, section, status, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  'Case Conflict of Interest and Reporting Policy',
  'county_policy',
  NULL,
  'Fresno County',
  'completed',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Chunks for Policy_Sample.pdf

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  'Case Conflict of Interest and Reporting Policy

Revision Date: January 2005    Replacing: N/A

Policy:

Employees are required to complete a case conflict of interest reporting form. A conflict case is any case in which any of the following are true in any county or region in the State of California:

- Employee is a Custodial Parent (CP), Non-Custodial Parent (NCP) or Child (CH);
- Employee''s spouse or other family member is a Custodial Parent (CP), or Non-Custodial Parent (NCP);
- Employee''s relationship with a person who is a Custodial Parent (CP), Non-Custodial Parent (NCP), Child (CH), is such that a person aware of all the facts might reasonably entertain a doubt that you would be able to act with integrity, impartiality, and competence;
- Employee''s relationship is close enough with a person who is associated with a case (current spouse, relative, boyfriend/girlfriend/close friend of a participant), such that a person aware of all the facts might reasonably entertain a doubt that you would be able to act with integrity, impartiality, and competence;
- If the employee is uncertain whether or not a case is a conflict case, the employee is to ask their Supervisor.',
  'Policy Definition',
  0
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  'If employee has a conflict of interest case:

1. EMPLOYEE CANNOT OPEN THE CASE. Employee must go through regular channels to open a case.
   a) Obtain an application from Reception to open a case.
   b) Call (866) 901-3212 to request a packet be mailed to employee.
   c) Use the Web site www.childsup.cahwnet.gov to obtain more information.

2. Employee must not work on the case, look at it on the computer system, or have any contact with the case.

3. Employee must go through regular channels on employee''s own time (i.e.: break, lunch hour, vacation) to discuss the case in question.

4. Employee must not obtain or divulge any information from or work on any conflict case.

Note: Should the employee become aware of a conflict case in the future, the employee will fill out a "Case Conflict of Interest Reporting Form," for each case, and return the form(s) to the employee''s supervisor who will then forward to the Security Team.',
  'Employee Requirements',
  1
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  'Employee is to complete the form(s) to the best of employee''s knowledge and understand that a violation of the agency''s Confidentiality Policy and Procedures may result in disciplinary action up to and including termination from employment.

**This policy requires completion and signatures of ALL Employees – Please see employee''s manager if employee has not done so within the prior 12 months or employee becomes aware of new information.',
  'Compliance Requirements',
  2
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  'Reporting a Case Conflict of Interest and/or Violation

Date: Wednesday, October 12, 2016 1:04 PM
To: All Staff
Subject: Reporting a Case Conflict of Interest and/or Violation
Importance: High

Good afternoon,

This email is to serve as a reminder regarding the agency''s Case Conflict of Interest and Reporting Policy. This agency has a responsibility to safeguard all case information. There are Federal and State requirements that must be followed to ensure case and participant information is not compromised and that information is accessed based on a business need to do so. If you have a case conflict of interest, you are to complete the Case Conflict of Interest Reporting Form and turn it into your supervisor.

You are expected to adhere to this policy, which includes following the protocol for reporting a case conflict violation. The system tracks worker activity within a case, whether or not a case activity note is entered. Additionally, the system tracks attempted access to cases that you have been conflicted out of.',
  'Reporting Violations',
  3
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  'If there is an attempt to access a case you have been locked out of, you must report it immediately to your supervisor. If your supervisor is not available, you must report it to your manager. If they are not available, you must report it to someone of authority, such as another supervisor or manager. You must send an email informing them of the violation. If you have the information, include the case number and/or participant ID, and the situation or reason you were trying to access the case. If your reason for attempting to access the case is due to working a document or piece of mail, you must give the supervisor and/or manager the document or mail at the time you report the incident to them. If the attempted access is due to working a phone call, interview, task, or some other type of case work, you must provide the supervisor and/or manager with this information as the work will need to be reassigned.

Remember, if at any time you become aware of a conflict with a case or participant, you are to complete a conflict form, and not just at the time we update our annual forms. This form is to be submitted even if you do not know the case number.',
  'Violation Reporting Procedures',
  4
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  'If you have a conflict of interest case, do not attempt to access the case to work or look at. You are not to ask another employee to look at or work the case. Do not risk your job or your friend''s job over a conflict case.

A violation of the Confidentiality Policy and Procedures may result in disciplinary action up to and including termination from employment.

If you have any questions about this policy, please talk to your supervisor. Thank you.',
  'Consequences and Contact',
  5
);

-- ============================================================================
-- DOCUMENT 2: Procedure_Sample1.pdf
-- Source: county_procedure
-- Title: Initial Pleading Practices
-- ============================================================================

INSERT INTO documents (id, title, source, source_url, section, status, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Initial Pleading Practices',
  'county_procedure',
  NULL,
  'Child Support Establishment',
  'completed',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Chunks for Procedure_Sample1.pdf

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Initial Pleading Practices (IPP)

Updated: 01/06/2026

The following Initial Pleading Practices (IPP) are in place and are to be followed to promote greater uniformity and consistency of child support orders throughout California. The goal is to have consistent and uniform practices statewide that take into consideration the unique circumstances of our customers and current child support laws and regulations in an effort to achieve accurate and reliable child support judgments.

The following IPP will address the following topics:
• Determine Timeshare/Visitation
• Actual Income
• Earning Capacity
• Zero income (i.e. $0.00 Judgments)',
  'Introduction',
  0
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'IMPORTANT NOTES REGARDING INITIAL PLEADING PRACTICES:

• When reviewing a case for an S&C you are to make reasonable diligent attempts to contact the appropriate parties on the case to gather relevant information. Collaboration with our customers is paramount. This includes speaking to customers about the importance of having accurate information for the purposes of calculating support.

• The totality of an individual''s situation should be considered when determining the factors to be used to calculate child support, and the information considered must be clearly detailed in the case activity log.

• Make every reasonable effort to reach an agreement (i.e. Stipulation) with a customer(s).

• If the PPS does not agree with any of the factors used to calculate support (e.g. income used, timeshare, etc.), you are to inform the PPS of their right to file an Answer and appear in court to address the issue of support.

• If the PPS files an Answer, encourage the PRS to appear in court.

• If income is unknown, use actual income or earning capacity.

• We will continue to use the 50/50 allocation of add-ons when using the Guideline Calculator. The Guideline Calculator is not currently designed to automatically do the proration calculation even when the radio button is selected. We are choosing not to perform manual calculating the proration based on both parties net disposable income.',
  'Important Notes',
  1
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Determining Timeshare/Visitation Percentage

Considerations regarding the calculation of timeshare:

• Timeshare is a percentage representing a parent''s respective period of primary physical responsibility for the child(ren).

• A court order that awards custodial periods of time, or visitation, does not control the calculation of timeshare; rather, timeshare is based on what actually occurs. A court order that awards timeshare may be relevant in timeshare calculation if the order is recent and there has not been an opportunity to exercise the terms of the order.

• Telephone contact with a child does not establish or increase a parent''s timeshare.

• Visitation that occurs at the PRS''s residence may not establish or increase a parent''s timeshare.

• If the PRS is receiving cash assistance, the maximum timeshare for the PPS is 49.99%.

IF the amount of timeshare is unknown, or cannot be confirmed by the PRS, THEN base guideline child support on a 0.00% timeshare.

IF the amount of timeshare is disputed, discuss the disputed timeshare with the parties and attempt to reach a compromise (i.e. run multiple guideline calculations, and inform the parents of the support factors).
• If they agree use the agreed upon timeshare to calculate child support.
• If they cannot reach an agreement, use the timeshare provided by the PRS, encourage the PPS to file an Answer, and allow the court to resolve the dispute.

Note: The PRS does not have the option to file a response to the complaint; therefore, the parenting time is based on the PRS''s claim.

IF the amount of timeshare is confirmed by the PRS, THEN base guideline child support on the timeshare verified by the PRS.',
  'Determining Timeshare',
  2
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Actual Income

Considerations regarding known income:

• A complaint shall provide notice of the amount of child support that is sought based on Actual Income.

• Actual income must be used if available (e.g. current pay stub, Wage and Insurance Verification received for current employer, etc.) and is an accurate representation of prospective (i.e. future) earnings. Note: All overtime should be included when calculating a parent''s average monthly income unless overtime will be eliminated or reduced and we verify this with the employer.

• There are certain parameters pertaining to the use of reported earnings from sources including but not limited to the EDD on the Participant''s Income List in CSE, The Work Number (TWN), or Statewide services Portal (SSP) NDNH report. Earnings reported by EDD can be one to two quarters behind.

• Reported income of 18 months or less can be considered if the facts seem to indicate that the reported income accurately reflects the prospective earnings of a party. Facts that would indicate the need to use a shorter period include, but are not limited to:
  o New Employment
  o Job change/Promotion/Demotion
  o Termination from employment
  o Report of a significant change of income that can be verified.',
  'Actual Income Overview',
  3
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'IF a party is currently employed (including self-employment) and their earnings/income is known, verified, and accurately represents the party''s prospective earnings, THEN base guideline child support on the party''s verified earnings.

Examples of sources used to verify earnings/income:
• Current Paystubs
• Most recent year income tax return, profit & loss, and/or attached documents
• Wage and Insurance Verification Form
• The Work Number (TWN)
• Bank statements

Note: Consider the period of time that is represented in the verification provided (e.g. payroll year, hire date, etc.).

IF one of the following exists:
• A party receives SSI/SSP/CAPI or CalWORKS and is reporting income (i.e. wages), OR
• A party lives in a household receiving cash assistance from a Title IV-A agency and is not included in the cash grant, and is reporting income to DSS,
THEN base guideline child support on the additional income reported. Note: Do not include the SSI/SSP/CAPI or CalWORKS grant as income.',
  'Actual Income Scenarios - Employment',
  4
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'IF a party receives SSA benefits, THEN base guideline child support on the party''s SSA benefits and any other reported income, if applicable. Confirm that the Other Parent has applied for derivative benefits for the child(ren). If the Other Parent is active aid, notify the Eligibility Worker (EW) of the Other Parent''s potential eligibility to receive Derivative Benefits.

IF a party receives one of the following Title II benefits: Social Security Disability (SSDI), Railroad Retirement, or Veteran''s Administration (VA) Benefits, THEN base guideline child support on the party''s Title II benefits and any other reported income, if applicable. Confirm that the Other Parent has applied for derivative benefits for the child(ren).

IF a party is receiving SSDI benefits and states that they have been denied SSI/SSP due to excess income, THEN base guideline child support on the party''s current SSDI benefit. Confirm that the Other Parent has applied for derivative benefits for the child(ren).

IF a party is employed seasonally and receives UIB during the off season(s), THEN base guideline child support on the party''s average monthly wages and the average monthly UIB. For example, NCP earned a total of $12,000.00 in wages for six months and $6,000.00 in UIB for the other six months. The guideline calculation should show monthly earnings in wages of $1,000.00 ($12,000.00 / 12 months) and monthly UIB of $500.00 ($6,000.00 / 12 months).',
  'Actual Income Scenarios - Benefits',
  5
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'IF a party is confirmed to have voluntarily checked in to a rehabilitation or psychiatric facility, and they are currently employed, THEN base guideline child support on the party''s verified earnings.

IF the PPS''s income, or self-employment income, is provided verbally by PPS, THEN base guideline child support on the income provided verbally by PPS when the earnings are equal to or greater than 40 hours per week at the current minimum wage rate.

IF the PPS''s income, or self-employment income, is provided by a verbal statement from both the PRS and PPS, and both the PPS''s and PRS''s statements support each other, THEN base guideline child support on the income corroborated by both parties'' verbal statements.

IF a PPS''s current employer and/or earnings/income are unknown, but reported income is available, THEN base guideline child support on an average of the party''s most recently reported income within the last 18 months assuming the earnings are indicative of the PPS''s actual or prospective earnings. Calculate income using the following formula: Total income for the specific earning period divided by the number of months in which the income was earned, equals the monthly income based on the income history for the specific earning period.

Note: When analyzing CSE''s Income List make a reasonable effort to verify the beginning and end date of the income period. If the facts seem to indicate that reported income falling within the last 18 months does not accurately reflect future prospective income for the PPS, review the details with a Supervisor/Attorney.',
  'Actual Income Scenarios - Other',
  6
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Earning Capacity

Considerations regarding earning capacity:

• When actual income is unknown, earning capacity must be used. For initial pleadings, the amount pled for earning capacity will equal the current minimum wage rate at 40 hours per week.

• The S&C must identify which of the 14 earning capacity factors were known at the time of filing.

• Earning Capacity should not be used for the PRS.

• The absence of income or reported income does not mean someone''s income is zero. This person could be self-employed or have income from sources that do not appear in CSE and is not reported to EDD.

• The "Earning Capacity" checkbox in the "Calculate Wages/Salary" section must be checked when generating an S&C based on earning capacity. The radio buttons for "some" or "all" need to be selected as applicable. The income will need to be manually input in the guideline calculator based on 40 hours per week at current minimum wage.

• Inform the other parent about earning capacity orders and let them know that the judgment will be reviewed for accuracy annually and when the first child support payment is received.',
  'Earning Capacity Overview',
  7
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Earning Capacity Scenarios:

IF the PPS''s actual income is unknown, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate.

IF the PPS''s income, or self-employment income, is provided by a verbal statement from both the PRS and PPS, and the PPS and PRS''s statements do not support each other, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate.

IF the PPS''s income, or self-employment income, is provided verbally by PPS and falls below 40 hours per week at the current minimum wage rate, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate.

IF the PRS provides an unverified verbal or written statement of the PPS''s earnings, and after due diligence and reviewing every statewide income reporting database cannot support the other parent''s statement, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate.

IF PPS lives in a household receiving cash assistance from a Title IV-A agency but is not included in the cash grant, is not the payee on the cash grant and has no other source(s) of income/asset, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate.',
  'Earning Capacity Scenarios Part 1',
  8
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'IF PPS''s earnings/employer are unknown, but the occupation is known, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate.

IF PPS is being supported by their parent(s), spouse, sibling, significant other, etc., and there is no evidence of disability, drug addiction, alcoholism, or incarceration, and there is no employment or recent income history, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate.

IF PPS resides in another jurisdiction (i.e. outside of CA) and we do not locate any current income or reported income and have conducted due diligence to find income and/or earnings, THEN calculate guideline child support based on earning capacity of 40 hours per week at the current minimum wage rate for the other jurisdiction when there are no reported or verifiable earnings.

Note: Consider involving the other state in the establishment process by contacting the other jurisdiction''s Central Registry. The other jurisdiction may have income/earnings information that is not available to us.',
  'Earning Capacity Scenarios Part 2',
  9
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Zero income (i.e. $0.00 Judgments)

Considerations regarding no income:

• The totality of a PPS''s situation should be considered when determining whether a $0.00 judgment is appropriate.
• If no income or earnings information exists a $0.00 judgment is not necessarily the appropriate action.
• A zero judgment should not be obtained based solely on a PPS''s undocumented status.

IF any of the following apply, THEN base guideline child support on the party''s zero income:
• The PPS is expected to be incarcerated for more than 90 days (including court-ordered/involuntary placement in a rehabilitation, or psychiatric facility) and has no other source(s) of income/assets from which to pay support; OR
• A party is confirmed to have voluntarily checked in to a rehabilitation or psychiatric facility and is expected to be in the facility for more than 90 days, and they are not currently employed; OR
• A party is the payee of a cash assistance grant (including K1 and 3F aid codes); OR
• A party lives in a household receiving cash assistance and is included in the grant for hardship children from a Title IV-A agency, and has no other source(s) of income/asset.

Note: See the "Earning Capacity" section of this guide for a party who is in an aided home with a status of "excluded," or "timed out" and is not the payee of the cash grant.',
  'Zero Income Scenarios Part 1',
  10
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'IF a party is the payee of a General Relief grant from a Title IV-A agency, THEN base guideline child support on the party''s zero income.

IF a party is medically verified totally and permanently disabled, and has no other source(s) of income, THEN review the Disability and Medical Information Verification form with a supervisor before generating an S&C to determine the validity of the form and to determine if support should be based on zero income.

Important notes about this process:
• The PPS may or may not provide documentation supporting their claim of total and permanent disability. Either way, we will verify the PPS''s claim with the PPS''s primary physician directly.
• Verify the PPS''s physician''s name, address, and phone number.
• Generate form set FS-CIU-036: Disability and Medical Information Verification. Have the PPS complete SECTION I: Patient Information and Medical Release. Review Section I for completeness and accuracy. Send the form directly to the PPS''s physician. The form must be received directly from the PPS''s physician.
• The information provided by the PPS''s physician must clearly indicate the PPS is totally and permanently disabled and is unable to work.

IF the party to pay support is a minor, and is not legally emancipated, THEN base guideline child support on the party''s zero income.',
  'Zero Income Scenarios Part 2',
  11
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  'Note: If a party receives SSI/SSP/Cash Aid Program for Immigrants (CAPI) benefits and has no other source(s) of income/assets:

If parentage has been established:
• Review the case for closure.

If parentage is at issue:
• Review for a parentage only S&C and then review for closure after the judgment is filed.

Cash Aid Program for Immigrants (CAPI): CAPI is a 100 percent state-funded program designed to provide monthly cash benefits to aged, blind, and disabled non-citizens who are ineligible for SSI/SSP solely due to their immigrant status. The welfare reform act of 1996 (P.L. 104-193) eliminated Supplemental Security Income/State Supplementary Payment (SSI/SSP) eligibility for most non-citizens. The aid code for CAPI is 6T and it can be received from any California county by anyone that is a naturalized citizen or a legal immigrant who otherwise qualifies for SSI/SSP.',
  'Zero Income - SSI/SSP/CAPI',
  12
);

-- ============================================================================
-- DOCUMENT 3: Procedure_Sample2.pdf
-- Source: county_procedure
-- Title: Calculating Guideline Child Support
-- ============================================================================

INSERT INTO documents (id, title, source, source_url, section, status, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Calculating Guideline Child Support',
  'county_procedure',
  NULL,
  'Xspouse Calculator Guide',
  'completed',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Chunks for Procedure_Sample2.pdf

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Procedure for Calculating Guideline Child Support

Note: Use the Xspouse™ Calculator to calculate guideline child support. Refer to the ''Calculating Guideline CS in Xspouse™'' for information about entering factors in the application. The ''Xspouse™ User Manual'' is also available for reference.

Effective January 1, 2026, minimum wage will increase to $16.90 per hour in the State of California. This change is expected to be available in CSE as of January 1, 2026.

There are also other tax changes to be aware of due to H.R. 1(OBBA) being signed into law on July 4, 2025, with retroactivity to January 1, 2025. The following changes could potentially impact guideline calculations. You will know whether any of these income tax deductions are applicable by verifying the information in the person''s income tax return (if available).',
  'Introduction',
  0
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Tax Changes Effective 2025-2026:

Overtime: An individual can deduct the pay that exceeds their regular rate of pay (the "half" portion of "time-and-a-half" compensation) up to $12,500 or $25,000 for joint filers from their federal taxable income. The tax benefit phases out for taxpayers with income over $150,000 or $300,000 for joint filers. You must be a non-exempt W-2 employee.

Tips: An individual can deduct up to $25,000 in qualified tips from their federal taxable income. For self-employed individuals, the deduction may not exceed the individual''s net income from the trade or business in which the tips were earned. The tax benefit phases out for taxpayers with income over $150,000 or $300,000 for joint filers. It is available for itemizing and non-itemizing taxpayers. If married, a joint filing is required to claim the deduction.

Increase to Limitation on Itemized Deduction for State and Local Taxes: Individuals who itemize their deductions can claim up to $40,000 or $20,000 if married filing separately for state and local taxes paid. This limit was increased from $10,000 or $5,000 if married filing separately. The deduction phases out for taxpayers with income over $500,000 or $250,000 if married filing separately.',
  'Tax Changes - Part 1',
  1
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Tax on Car Loan Interest: Individuals may deduct interest paid on a loan used to purchase a qualified vehicle, provided the vehicle is purchased for personal use and meets other eligibility criteria. The maximum annual deduction is $10,000. The deduction phases out for taxpayers with income over $100,000 or $200,000 for joint filers. It is available for itemizing and non-itemizing taxpayers.

Deduction for Seniors: Individuals who are age 65 and older may claim an additional deduction of $6,000 or $12,000 total for a married couple where both spouses qualify. The deduction phases out for taxpayers with income over $75,000 or $150,000 for joint filers. It is available for itemizing and non-itemizing taxpayers. When you input the dates of birth for parties in Xspouse in the "Party Tax Information" it will calculate the deduction for you.',
  'Tax Changes - Part 2',
  2
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Purpose: This procedure sets departmental policy regarding the criteria used in determining guideline child support, and provides direction on utilizing the Internal Guideline Calculator.

Introduction: Obtaining accurate and enforceable child support orders is the most effective way in achieving immediate and long term child support payments as well as compliance from a PPS. In the event new income information is found after the establishment of a child support order that could cause the order to go up or down, the order can be reviewed for a modification.

Determining the PPS''s financial ability is a key factor. Please refer to the Initial Pleading Practices (IPP) for details about the department''s order setting practices.

It is the intent of this policy to recognize the PPS''s responsibility of paying support and maximize the amount of support that can be collected based on PPS''s ability to pay. Creating unrealistic child support orders contributes to substantial arrears impacting low wage earners with overwhelming child support obligations. Consequently, this contributes to a negative impact in the parent-child relationship.

It is imperative that the correct type of income is selected and identified on the Summons and Complaint and Proposed Judgment. Every effort should be made to identify actual income when calculating child support. Earning capacity should only be used in specific situations.',
  'Purpose and Introduction',
  3
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Gathering Information - SECTION I: Interview / Case Opening

The Custodial Party (PRS) is the most important and immediate source of information in most cases. The PRS will usually know one of the following scenarios about the circumstances of the PPS. Questions eliciting information about unknown circumstances or earnings should be asked in every intake interview with the PRS to obtain as much information as possible.

The PRS may know or have information about:
• PPS''s current address
• PPS''s current employer
• PPS is self-employed and can provide information concerning PPS''s earnings, or can obtain tax returns
• PPS''s type of occupation, but does not know name of employer
• PPS is self-employed but has no information concerning earnings
• PPS works but does not know occupation or employer
• PPS''s current address only, no earnings information known
• PPS lives with a relative/spouse/girlfriend/boyfriend
• PPS is or has been incarcerated
• PPS is on assistance, sometimes with other children
• PPS is living on the streets (homeless)
• PPS is a substance abuser and unemployed
• PPS is a criminal and unemployed',
  'Gathering Information - Interview',
  4
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Questions for the Other Parent RE: PPS''s Income

Only use these questions when the PPS''s current employer is unknown and the PPS is not currently incarcerated or receiving public assistance. Ask and obtain an answer for all questions. If an answer is unknown by the PRS, state it is "unknown" in the case narrative summary of questions and answers.

1. Has (Mr./Ms. Name) ever received, is receiving now or applying for: Welfare (cash aid), general assistance, Cal Fresh (food stamps), or Medi-Cal? Workers Compensation? Veteran''s benefits? Disability? Unemployment benefits? Social Security benefits? Any kind of benefit that you know of? If yes to any of the above: How much is the amount received and when did it start?

2. What is the usual occupation of Mr./Ms. (Name)?
3. Does Mr./Ms. (Name) have a driver''s license? If so, what state issued the license?
4. Does Mr./Ms. (Name) have a business or professional license such as a contractor, hairdresser, etc.?
5. What is the highest grade of school Mr./Ms. (Name) completed?
6. Is Mr./Ms. (Name) currently going to school to complete high school or attending a training program?
7. How does Mr./Ms. (Name) support themselves (buy food, clothing, pay rent)?
8. Does Mr./Ms. (Name) live with relatives? Do they support them?
9. Does Mr./Ms. (Name) use drugs or alcohol? If yes, are they able to keep a job? Has Mr./Ms. (Name) gone through a drug treatment program?
10. Do you know of any handicaps or disabilities Mr./Ms. (Name) might have? If yes, was Mr./Ms. (Name) injured on the job?',
  'Interview Questions',
  5
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'SECTION II: Research, Investigation, and Locate

If PPS''s employer is known: Attempt contact with employer to get needed information directly. If unable to get information immediately, fax an employment verification letter.

If the PRS provides PPS check stubs: If check stubs are for a current employer, use them to determine actual earnings of the PPS. If the check stubs are older, attempt to verify employment with employer and request current income information.

Once the earnings information is known, other factors that may affect the support calculation are known, and sufficient identifying information and locate is complete, prepare the support calculation for the proposed judgment.

We must have sufficient identifying information for the NP which means we must have at least one of the following three combinations provided to us by the PRS in order to confirm we locate the correct individual:
• First & Last Name & DOB, OR
• First & Last Name & DOB & last known address, OR
• First & Last Name & SSN

If the PPS is unknown, or PRS has only provided a partial name and no other information for PPS, we must have a signed attestation statement from PRS. If attestation statement is not on file, contact the PRS to come into the office to complete an attestation statement. This is required for compliance purposes. If there is one on file and the case meets closure criteria, generate documents and refer to close.',
  'Research and Investigation',
  6
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'If the PRS provides sparse information on the PPS, you will need to do locate for the PPS. It is probable that you will get multiple hits on your locate search based on common names. If you cannot exactly match the PPS as described above to one of the individuals you have located, you will need to order a DMV photo or arrest photo of the PPS for PRS to identify. You can request a DMV photo for up to three of the possible hits at one time for the purpose of presenting them to the PRS for positive ID of the PPS. Do not proceed with the S&C process until the PRS has positively identified the PPS by photo.

A Postmaster letter confirms mailing addresses and not physical locations of the PPS. There are many PPSs who do not update their mailing information. Mail could continue to go to a relative, friend, etc. for an extended period of time after the PPS has already moved. Therefore, a Postmaster letter should not be the primary source of address verification.

For scenarios where income information is sketchy or unknown and before establishing any judgment using earning capacity, you must check all available locate sources for income or income history, such as Participant Level Screens (Locate, Locate Responses). Review responses from EDD, FTB, and FCR.

These additional sources will help to obtain information regarding income or lack of income or information that we do not have. You must also contact the PRS and PPS to confirm or clarify information needed prior to proceeding with an S&C.',
  'Locate Procedures',
  7
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'SECTION III: Analysis and Application of Information

Review the situation guides below to gain an understanding of the factors that will be used in the guideline calculation for either Establishment or Review & Adjustment. Refer to the Initial Pleading Practices guide and the R&A Situation Guide.

Note regarding analysis of application: The information in the above guides applies to all PPSs, including undocumented and minor PPSs.

Note regarding low wage earners: When the PPS''s net income falls below $2,929.00, the low income adjustment (LIA) applies and the pleading/order must be based upon the LIA as it appears on the calculation results (CSS Letter 05-35).

Note regarding allocating child support: If the PPS is obligated to pay current support on more than one child per court order, the child support is to be allocated by age of the children.',
  'Analysis and Application',
  8
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Before You Begin

Zero dollar orders do not require a Guideline Calculator printout.

INCOME: Use both party''s actual earnings / income or other earnings as defined by Family Code section 4058.

PUBLIC ASSISTANCE CASE WHERE NEITHER FATHER NOR MOTHER ARE THE CUSTODIAL PARTY: There shall be no imputation of income to the caretaker/payee or governmental agency.
• If the parents reside apart and neither are the custodial party, there will be two cases, where each is the PPS. A calculation will be run in each of their cases when all appropriate information is obtained.
• If the parents reside together and neither are the custodial party, there will be two cases, where each is the PPS. A calculation will be run in ONE of the cases, bringing the other absent parent into the calculation using the "Other Parent as NCP" section.

LOW INCOME ADJUSTMENT: If the PPS''s Net Allowable income is less than $2,929.00, use the low income adjustment. You will be prompted by the Guideline Calculator to set the "Apply Low income Adjustment field to "Yes."

VISITATION: Use the actual visitation percentage. When actual income and the visitation percentage is none or unknown, use zero percent.',
  'Before You Begin',
  9
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'HEALTH INSURANCE: If the cost of health insurance is known AND the LIA does not apply, whether or not the PPS has the children currently covered, and we will be enforcing it by serving a NMSN, use the cost of health insurance in the Guideline Calculation. You must include the cost of the health insurance for the provider and dependents. If the LIA applies, do not include the cost of H/I, since a NMSN will not be sent to the employer if the LIA applies.

HARDSHIP CREDIT: A hardship credit applies to a party (PPS or Other Parent) who has a biological child in their home from another relationship.
• Unless we obtain information the child has a parent who is incarcerated, deceased, or there is an order but no payments, then only a half (0.5) hardship credit should be applied.
• If we have/obtain information that a child has a parent who is incarcerated, deceased or there is an order but no payments, or the party has been granted Good Cause for the hardship child(ren), then a full (1.0) hardship credit can be applied. If the custodial parent of the hardship child(ren) has not attempted to obtain a child support order (and the above exceptions are not applicable), then only a half (0.5) hardship credit should be applied.

ARREARAGE COMPUTATION: Effective January 01, 2005, AB 2669 eliminates retro-arrears (one year back from the filing of the S&C). The effective date of child support will be the same in both welfare and non-welfare cases, which is the first of the month after the file date of the S&C.',
  'Calculation Factors',
  10
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'The Guideline Calculator - Accessing and Creating a New Record

A Court Caption must exist prior to adding a guideline calculation.

1. From the Case Overview Screen, click the Legal Activities local link.
2. On the Legal activities Page, click the Guideline Support Calculation List detail link.
3. This takes you to the Guideline Support Calculation List.
4. The Guideline Support Calculation list displays previously saved calculations.
5. To add a new calculation, click the "Add" button. This will take you to the Guideline Support Calculation Detail screen.

Input Fields - Dependent Information:
• To include a child in the calculation, click the checkbox to the left of the child. If the check box is not marked, that child will not be included in the calculation.
• Important: This section lists all children on the case, regardless of their status (e.g. emancipated, excluded, etc.).

Prior Period Date Range: Clicking on the link will access the Prior Period Date Range Detail page. Use this link to calculate an arrears period. Be sure to update the tax year on the calculation accordingly.

Time With NCP (%): Visitation percentages at the per child level. The percentage must be entered for each child. The system will automatically calculate the average visitation for use in the actual calculation. Calculate the actual timeshare for each dependent by adding the total hours each DEP(s) is with the PPS per year and then dividing the total by 8,760 hours (i.e. the total hours in a year).

Example: A PPS has a DEP every other weekend from Friday at 6:00 PM to Sunday at 6:00 PM which equals 48 hours. Multiply 48 hrs with 26 weekends and that equals a timeshare of 1,248 hrs/year for the PPS with the DEP. Divide the 1,248 hrs by 8,760 hrs/year, which is 14% visitation.',
  'Using the Calculator - Setup',
  11
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Other Parent is NCP (Foster Care or Other Non-Parent Custody)

Use this section when:
• There is Foster Care or Non-needy Payee situations
• And there is a case against each parent. (NOTE: This will be used when the parents are living together.)
• By indicating that the other parent is the PPS, CSE will calculate the amount owed by each parent.
• IMPORTANT: If the parents are not living together, the circumstances of each parent may be different and two different calculations will be required.

Process:
• Click the Select link to begin the process of setting the other parent as PPS. This will take you to a case search screen.
• Search for the case where the other parent is listed as the PPS.
• The search results page will display the case and the PPS name. From that page, click the Select button. This will bring the other parent''s name into the case as the 2nd PPS and set CSE to calculate the child support amount for both parents.
• When the Calculation is saved, it will automatically save a copy of the calculation in both cases.',
  'Other Parent as NCP',
  12
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Tax Information

This section must be completed to continue with the guideline calculator. The NCP and the Other Parent tax information will be entered in this section.

• Tax Year: Select the tax year from the drop-down menu, this field will default to the current year.
• Federal Tax Filing Status: Select from the drop-down menu for both parties, NCP and the Other Parent
• Federal Tax Exemptions: Verify the default number of exemptions is correct. If not, then enter the correct number of exemptions based on the income tax filing in the text box.
• State Income Taxes: If state income taxes were not filed in California, but rather in another state, deselect the radio button for California. Otherwise leave the radio button selected. If California Taxes Information apply, then proceed to complete the California Tax Filing Status and select from the drop down menu.

Note: The Federal Tax Exemptions fields for the Other Parent will populate automatically with the number of the family members based on Filing Status and Minor Children in the case. This field for the PPS will list 1 and will not change. You will need to manually increase or decrease these credits for either parent if it is necessary for a calculation.',
  'Tax Information',
  13
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Other Tax Settings

To open and view the options you must click the expand (+) button.

Other Federal Tax Settings: This section lists information regarding Federal Income Taxes. The boxes will be automatically checked and should only be unchecked in special circumstances. The three fields that indicate the number of children for special exemptions are the most important. These fields default to the number of children in the case for the other parent. If PPS has children that qualify for these deductions or the Other Parent has additional children that should be added, the number must be changed manually.

• Number of Children for Child Care Credit
• Number of Children for Earned Income Credit
• Number of Children for Child Tax Credit

This section also has additional Check boxes for the following possible tax settings that may be applicable (Select only those that apply):
• Parent is Blind
• Parent is 65 or Older
• New Spouse is Blind
• New Spouse is 65 or Older
• Deduction type when PPS and Other Parent are married to each other, filing separately: The option to select Itemized Deductions or Standard Deduction, make sure and select the correct deduction.',
  'Other Tax Settings - Federal',
  14
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Other State Tax Settings

This section lists information regarding California income taxes. The boxes will be automatically checked and should only be unchecked in special circumstances (such as the person does not live in California). These fields default to the number of children in the case for the other parent. If PPS has children that qualify for these deductions or the Other Parent has additional children that should be added, the number must be changed manually. If either parent lives in another state, the other state''s income tax rate can be entered in the Other State Tax Rate field.

• California Tax Exemptions (Registered Domestic Partner Only)
• Children for California Child Care Credit
• California State Income Taxes
• California State Disability Insurance
• California Dependency Credit for Dependent Parent(s)
• California Joint Custody Head of Household Credit
• California Renter''s Credit - This field should be unchecked if you know the party is a homeowner
• Other State Tax Rate: This field should be completed if you have the information for the Other State Tax Rate
• Other State Tax Amount: $ - This field can be completed if you have the actual amount of the Other State Tax Dollar Amount.',
  'Other Tax Settings - State',
  15
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Monthly Income Information

The Monthly Income Information section allows for the entry of income information pertaining to the PPS and, if applicable, the Other Parent. This section is editable when adding a new calculation or editing a calculation saved as "Draft". This section is read-only for calculations saved as "Active", "Inactive", or "Historic".

• Earning Capacity Income: When checked, indicates the income for the PPS is unknown and the support calculation is based on Earning Capacity.
• Earning Capacity Income Used: Click on a radio button to indicate if ''Some'' or ''All'' of the income for the PPS is based on Earning Capacity. This selection does not affect the calculation but only indicates how much of the income is based on earning capacity.
• Wages/Salary Text Box: (MONTHLY) Enter the amount of the PPS and, if applicable, the "Other Parent" income from wages from a job or work.

Calculate Wages/Salary Subsection - Note: To view options you must click on the expand + button.

• Presumed Income: For guideline calculations generated with the tax year 2026 or later, the Presumed Income checkbox will be greyed out. When checked, indicates that the income for the PPS and, if applicable, Other Parent is unknown and the support calculation is using presumed income. If presumed Income is being used, checking the "Presumed Income" box will populate the hours per week and minimum wage box per the most current wage scale.',
  'Monthly Income Information',
  16
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Earned Income Frequency - Payment cycle for the PPS and, if applicable, Other Parent. Selection Values are: Monthly, Hourly Wage, Weekly, Bi-Weekly, Semi-Monthly, Annual, Year-To-Date, Minimum Wage ($/hr).

• Hour/Week: Average number of hours the PPS and, if applicable, "Other Parent" works per week. For unknown income earning capacity, use minimum wage at 40 hours per week.
• Minimum Wage: Select the appropriate Minimum Wage option from the drop-down list.
• Amount Year-To-Date: Current Year-To-Date wages or salary for the PPS and, if applicable, Other Parent.
• YTD Date Range (Start Date & End Date): Date range the "Amount Year-To-Date" amount for the PPS and, if applicable, Other Parent begins and when it ends. Example: The PPS earned $26,000 from 12/15/05 to 8/1/06, enter 26,000 in the Amount Year-to-Date field, type 12/15/2005 in the first date range field, and type 08/01/2006 in the second date range field. This will automatically calculate the monthly amount earned.
• Imputed Income: Beginning with Tax Year 2026, this option is greyed-out and cannot be selected.
• Self-Employment Income: Monthly amount of self-employment income for PPS and, if applicable Other Parent. Note: If the self-employment income is less than $33.33 per month (or $400 per year), it will automatically be excluded from the guideline support calculation.
• Unemployment Compensation: Monthly amount of unemployment compensation income for the PPS and, if applicable, Other Parent
• Disability (Taxable): Monthly amount of disability income for the PPS and, if applicable, Other Parent',
  'Income Fields',
  17
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Other Taxable Income

This section holds input fields where we can enter other Taxable Income Information for the PPS and, if applicable, Other Parent. Note: If you are entering information in these fields, you should have income tax information on hand or verified the income to make sure accurate information is being entered.

• Social Security Income (Taxable)
• Other Income (Retirement, Annuity, SS Other Relationship, Operating Losses, etc.)
• Short-Term Capital Gains
• Long-Term Capital Gains
• Line 4e from IRS Form 4952
• Unrecaptured Section 1250 Gain
• Nonqualified Dividends
• Qualified Dividends
• Interest Received
• Royalties
• Rental Income
• Other Taxable Income Adjustments
• Other Non-Taxable income

Other Non-Taxable Income Details Subsection: To open and view the options you must click the expand (+) button. This section holds input field where we can enter Other Non-Taxable Income information for the PPS and, if applicable, Other Parent. Note: Income entered in this text field boxes will not effect the calculation and should be used only for informational purpose.

• Social Security Income (Non-Taxable)
• Other (Depreciation, Military Benefits, etc.)
• Tax Exempt Interest
• Disability
• Worker''s Compensation
• New Spouse Wages/Salary',
  'Other Income Types',
  18
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'New-Spouse Other Income and Deductions

To open and view the options you must click the expand (+) button. This section holds input field where we can enter New-Spouse Other Income and Deductions information for the PPS''s new spouse and, if applicable, Other Parent''s new spouse.

• Self-Employment Income
• Social Security Income (Non-Taxable)
• Social Security Income (Taxable)
• Other Taxable Income
• Spousal/Other Partner Support Paid Other Relationship
• Retirement Contribution if Adjustments to Income
• Required Union Dues
• Necessary Job-Related Expenses

Public Assistance and Child Support Received

This section holds input fields where we can enter, if applicable, Public Assistance amounts received and Child Support Received by the PPS and Other Parent.
• Public Assistance
• Child Support Received',
  'New Spouse and Public Assistance',
  19
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Sources of Income & Where to Enter on Child Support Calculation

Type of Income | Guideline Calculator Field
Wages (i.e. salary, hourly rate) | Wages + Salary
Overtime | Wages + Salary
Bonuses | Wages + Salary (Note: In some instances it may be necessary to verify with the employer how many times per year the bonuses are paid. Paid 1 time a year: divide by 12 months. Paid more than 1 time per year: add total for all times paid per year then divide by 12 months)
Self-Employment Business (Gross receipts – Reasonable Business Expenses) | Self-employment Income
Self-Employment Business Depreciation (As listed on Schedule C) | Non-Taxable Income
Unemployment Insurance Benefits (UIB) | Other Taxable Income
State Disability Insurance (SDI) | Non-Taxable Income
Worker''s Compensation | Non-Taxable Income
Veteran''s Administration Retirement | Taxable
Veteran''s Administration Disability | Non-Taxable Income
SSI/SSP | DO NOT USE
SSA | Other Taxable Income
Military (BAH, BAS, BAQ, Combat Pay) | a) Base Non-Combat Salary – Wages + Salary; b) BAH, BAS, BAQ – Non-Taxable Income; c) Base Salary IF IN COMBAT – Non-Taxable',
  'Income Source Reference',
  20
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Monthly Deduction Information

The Monthly Deduction Information section allows for the entry of tax deduction information pertaining to the PPS and if applicable, Other Parent.

• Child Support Paid (Other Relationships): Credit will only be given for current ongoing monthly support that is "actually" being paid. If payments include arrears payments, only give credit for the ongoing support. If payments are sporadic, take the average of what is being paid each month, up to the court ordered ongoing support obligation. Do not give credit for the court ordered amount unless it is actually being paid or the order is recent and an IWO has been sent to the current employer.

• Spousal Support Paid This Relationship
• Property Tax
• Mortgage Interest
• Required Union Dues
• Health Insurance Post Tax (Next to the entry fields you can also state if this is Pre-Tax Health Insurance cost, by selecting the Radio Button. Make sure you have verified this was a pre-tax Health Insurance before selecting the Pre-Tax Radio Button.)

Other Health Insurance: To access the input fields you must click on the Expand Button (+). The guideline calculator will automatically default to Post Tax Health Insurance Cost.
• Post-Tax Radio Buttons: The "Post-Tax" radio buttons will deselect if you select the "Pre-Tax" radio button located under the "Monthly Deduction Information" section under "Health Insurance Post Tax".
• Wage Deduction: Enter the actual amount of the monthly wage deduction.',
  'Monthly Deductions',
  21
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Mandatory Retirement (Tax-Deferred) & Other Retirement Contributions

The guideline calculator will automatically default to view only the Tax-Deferred Mandatory Retirement Field, but if Non-Tax-Deferred Mandatory or Voluntary Retirement information needs to be entered you must click on the Expand Button to view the entry fields.

• Mandatory Retirement (Tax-Deferred)

Other Retirement Contributions:
• Mandatory Retirement (Non-Tax-Deferred)
• Voluntary Retirement (Tax-Deferred)

Other Information: The following sections will provide input fields for the information listed below. These sections allow us to enter multiple types of possible deductions. These fields should be used very rarely.

Job Related Expenses & Spousal Support Other Relationship:
• Necessary Job-Related Expenses
• Spousal/Other Partner Support Paid Other Relationships

Other Itemized Deductions:
• Deductible Interest Expenses
• Other Medical Expenses
• Contribution Deduction
• Miscellaneous Itemized

Other Tax Deductions:
• Adjustments to Income
• Other Discretionary Deductions',
  'Retirement and Other Deductions',
  22
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Alternative Minimum Tax Information (IRS Form 6251) & State Adjustments

• Certain Interest on Home Mortgage
• Investment Interest
• Post-1986 Depreciation
• Adjusted Gain or Loss
• Incentive Stock Options
• Passive Activities
• Estates and Trusts Schedule K-1 (Form 1041)
• Tax Exempt Interest From Private Activity Bonds (Post 8/7/1986)
• Other Preferences (See IRS Form 6251)
• Alternative Minimum Tax Operating Loss Deduction

State Adjustments:
• State Adjustments to Income
• State Adjustment to Itemized Deductions

Extraordinary Health and Catastrophic Losses:
• Extraordinary Health Expenses
• Uninsured Catastrophic Losses',
  'Alternative Minimum Tax',
  23
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Hardship Children (FC 4071(b)) & Other Hardship Children Details

Monthly Hardship Deduction Calculation: This section allows you to enter information regarding "Hardship" children. It defaults to "Not applicable" meaning there are no hardship children. To enter hardship children, click the radio button next to Apply Hardship under Hardship Children (FC 4071(b)) section: Enter the number of hardship children needed for the calculation. Using the "Enter Dollar Amount" section will override entering the number of hardship children. It is generally best to use the Hardship Children Section for entering hardship children. Leave the Computation Method for Hardship to the default selection.

Notes: Unless we obtain information the child has a parent who is incarcerated, deceased, or there is an order but no payments, then only a half (0.5) hardship credit should be applied.

If we have/obtain information that a child has a parent who is incarcerated, deceased, or there is an order but no payments, or the party has been granted Good Cause for the hardship child(ren), then a full (1.0) hardship credit can be applied.

• Hardship Children (FC 4071(b)): Apply Hardship - A radio button is on side of the text box. You must enter the number of children that should be included if the Hardship applies for the children in the home.

Other Hardship Children Details:
• Enter Dollar Amount of Family Code 4071(b) Children: Unless the case is in court and the court orders a specific dollar amount hardship, we do not use this field to enter hardships.
• Number of Other Family Code 4071(b) Children: If applicable, enter the number of children claimed.
• Not Applicable - The radio buttons refer to this complete section.

Computation Method for Hardship - Subsection:
• Match Presumed Child Support Per Capita Radio Button - The system will automatically default to this selection.
• Match Basic Child Support Per Capita Radio Button - Select this if applicable',
  'Hardship Children',
  24
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Monthly Child Support ADD-ON Information

The Child Support Add-on section allows you to enter additional child support costs for children of this relationship that are generally shared between the parties.

FEM Final Rule Update:
• The Guideline Calculator settings now allow for a proration to be identified when requesting an order with add-ons such as childcare expenses and unreimbursed medical expenses.
• We will continue to use the 50/50 allocation of add-ons when using the Guideline Calculator.
• The Guideline Calculator is not currently designed to automatically do the proration calculation even when the radio button is selected. We are choosing not to perform manual calculating the proration based on both parties net disposable income.
• The calculator will default to the Proration radio button. All staff using the calculator on and after 9/1/2024, and calculating add-ons, will need to manually change to the 50/50 radio button.

The Child Support Add-on section also allows for the entry of Child Care amounts for other children (not of this relationship). This amount is not added to the child support amount, but it can affect tax information and amounts credited for hardship children.

Note: Money should be allocated only to those children for whom it was intended. The Monthly Total Amount of Child Support is comprised of the Basic Child Support Amount and Child Support Add-on Amount.',
  'Child Support Add-Ons',
  25
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'NCP Add-Ons:
• Dependent (not editable; lists names of children in the case)
• Child Care ($)
• Visit / Travel Expenses ($)
• School Expenses ($)
• Uninsured Health Expenses ($)
• Child Care for Other Children

Other Parent Add-Ons:
• Dependent (not editable; lists names of children in the case)
• Child Care ($)
• Visit / Travel Expenses ($)
• School Expenses ($)
• Uninsured Health Expenses ($)
• Child Care for Other Children

Allocation for Child Support Add-Ons: This is a radio button selection field
• 50/50: Indicates the child support add-ons are allocated 50/50 - The 50/50 radio button is the default selection.
• Prorate per Family Code 4061(b): Indicates child support add-ons are allocated per this section code
• After Support: Indicates the child support add-ons are allocated after support.

Note: Our local practice is to use the 50/50 option for the Allocation for Child Support Add-Ons. This will need to be manually selected when generating the calculation.',
  'Add-On Details',
  26
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Other Settings

Apply Low-Income Adjustment (LIA): Select "Yes" if the PPS''s net monthly income will be less than $2,929.00. If you select yes and the PPS''s net monthly income is more than $2,929.00, it has no effect. If it is used and the PPS''s net monthly income is less than $2,929.00, it gives the child support range and automatically selects the low end of the range.
• N/A - This is the default selection for this field
• Yes - This selection should be made if the net income is less than $2,929.00 and the LIA should be applied.
• No - This selection can be made if the LIA should not be applied, even if the net income is less than $2,929.00.

Calculate Temporary Spousal Support: The options to this field should only be used if spousal support will be calculated in the calculation. This office does not obtain spousal support order and should only be used if the case is in court and the commissioner has requested us to run a guideline calculation to include the temporary spousal support in the calculation. If we are requested to use it, we would select the Santa Clara radio button.',
  'Other Settings',
  27
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Processing the Calculator - Completing the Calculation

1. Enter a comment in the "Generation Reason Box" indicating why a guideline calculation is being run.
2. If the Net income of the PPS or Other parent is less then $2,929.00, choose Yes to apply the low income adjustment.
3. Once all the information is completed on the Guideline Support Calculation Detail page, click the Calculate Guideline Support button in the bottom right of the screen to view the results.
4. After reviewing the results page the information can be printed by clicking the Generate Form Set Button. This prints three pages.
5. To save the calculation you must first select the status. Use the drop-down box to choose one of the following options:
   a. Draft: A draft status will not write any activity logs on the case. Draft calculations are modifiable after they are saved. Any draft calculation with no activity for 30 days will be automatically removed from the system. Save the calculation as a "draft" if you are not finished with your work.
   b. Active: An Active status will write activities to the Case activities log on the case. Active calculations cannot be modified after they are saved. They will be read only files. Active calculations will remain on the system permanently. Save the calculation as "active" when documents are generated based on the calculation.
6. After selecting the status, click the Save button to save the calculation.
7. If an existing draft calculation has been modified, the new results can be saved as a new calculation by using the Save as New Calculation button. This will preserve the old calculation and write a new file with the new information.
8. After a calculation has been saved, it can be viewed and accessed again from the Guideline Support Calculation List page.',
  'Completing the Calculation',
  28
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Viewing / Modifying an Existing Calculation

1. To view an existing calculation, access the Guideline Support Calculation list page.
2. The list shows the date, children, tax year, total monthly support amount, and status of each calculation that has been saved in the case.
3. To view the input information, click on the link of the date and time of the calculation. This will take you to the Guideline Support Calculation Detail page. Draft calculations can then be modified and either overwritten or saved as a new file.
4. Active calculations will be view only.

Dueling Calculations

Important: Use this process when an PPS has more than one case that needs an order to be established or modified.

Do Not Run Dueling Calculation if: If PPS has multiple cases but was not the requesting party for the review, only generate the calculation in the case where the request was made. If the PPS was the requesting party, RAA will need to be initiated in all cases. If we are the requesting party, RAA will need to be initiated in all of PPS'' cases where aid is active. Running a dueling calculation is not appropriate since we are not changing the order in the second case. Dueling will be done if both cases are before the court. A credit under "Other Child Support Paid" should be given instead in this situation and the CSS in court will run a second calculation in court to show what the guideline is without the credit for the other child support paid.',
  'Viewing and Dueling Calculations',
  29
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Dueling Calculations Procedure:

1. To perform the Dueling scenario, you must sign in to two (or more) sessions of CSE.
2. Access one of the cases in question in each session.
3. Complete the calculation in one of the cases and find out the total child support amount.
4. Complete the calculation in the second case taking into account the amount of child support from first case in the Child Support Paid (Other Relationship) field.
5. Return to the first case and enter the total amount of child support from the second case in the Child Support Paid (Other Relationship) field and re-calculate the amount.
6. Return to the second case, update the Child Support Paid (Other Relationship) field with the new amount from the first case, and recalculate. Continue the process until the total child support amount on both cases no longer changes, then save each case''s calculation.

Zero Dollar Calculation

Scenario: A Guideline Calculation must be attached to every S&C, including $0.00 S&Cs. Some other legal actions may also require a guideline calculation to be attached, even if the action is requesting a $0.00 order. In these situations, a $0.00 calculation must be created to attach to the legal actions in CSE.

1. On the Guideline Calculation List page, click the Add button.
2. Make sure all the appropriate children are displayed and selected in the Dependent Information section.
3. Scroll down to the bottom of the page and use the Low Income Adjustment drop down box to select "Yes".
4. Click the Calculate Guideline Support button. This will take you to the Guideline Support Calculation Result Detail page. Scroll to the bottom of the page and use the Status drop down button to select "Active".
5. Click the Save button. This will take you to the Guideline Support Calculation List page with a confirmation notice.',
  'Special Scenarios',
  30
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Absent Mother - Multiple Dads

Scenario: In an absent mother case, there are two children with two different fathers, and the children are in Foster Care.

The CSE case construct would be as follows:
Case #1: PPS = Mom, PRS = Human Services System (Foster Care), PNC (01) = Dad #1, PNC (02) = Dad #2, DEP (01) = Child #1, DEP (02) = Child #2

In this scenario, you would have one statewide case against mom, but you would run two separate Guideline Calculations.
• Run first calculation for Child #1 and "uncheck" Child #2 in the Dependent section.
• Run the second calculation for Child #2 and "uncheck" Child #1 in the Dependent section.

Absent Mother - Multiple PRSs (Multiple Statewide Cases)

Scenario: In an absent mother case, there are multiple children with the same father, and the children are with multiple PRSs.

The CSE Case construct would be as follows:
Case #1: PPS = Mom, PRS = Human Services System, PNC = Dad, DEP (01) = Child #1
Case #2: PPS = Mom, PRS = Grandma, PNC = Dad, DEP (02) = Child #2

In this scenario, you will have two statewide cases, because the PPS is the same and the PRSs are different. However, you will not be imputing income to either PRS. If the PPS has no visitation with the child that is with grandma, proceed as follows:
• You will run one calculation in one of the absent mother''s statewide cases. You will bring in the other child from the other statewide case, run the calculation for all the children involved, and allocate the child support based on the age breakdown.
• To add the "Other Related IV-D" case into the calculation, you will need to add the case number on the "Related IV-D Case List" section on the "Court Caption" detail screen.',
  'Multiple Parent Scenarios',
  31
);

INSERT INTO chunks (document_id, content, section_title, chunk_index)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  'Adding an "Other Related IV-D Case"

1. Click the "Legal Activities" local link, then click the "Court Caption List" detail link.
2. From that page, click the appropriate Court Case Number hyperlink.
3. At the bottom of the Court Caption Detail page, there is a section entitled, "Related IV-D case list". Click the ADD button to link another case. This takes you to the case search screen.
4. Search for the case as appropriate (generally search by county case number e.g. 0193060571-01). The results page will ask you to select the case and click the Select button.
5. Once the Select button is clicked it will take you back to the "Related IV-D Case List."
6. To finish adding the related IV-D case, you must select the SAVE button. All children from the linked case will now be listed on the Support Calculation Detail page.
7. If a case was linked in error, it can be removed by selecting the radio button to the left of the case and clicking the remove button.

Guideline Calculation Shows Change in Payor (not an Establishment case)

If the Guideline Calculation indicates that the "Other Parent or CP" is to pay the "NCP" the child support; proceed with the Stipulation or a Notice of Motion, whichever is applicable.

Important: If a case does not currently exist where the roles are reversed, do NOT automatically open a case against the payee based on these results. A request for services from the "new" payee would be required in order for a case to be opened.',
  'Linking Cases and Change in Payor',
  32
);
