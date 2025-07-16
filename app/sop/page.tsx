'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as Tabs from '@radix-ui/react-tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const phases = [
  { 
    id: 1, 
    name: 'Client Intake & Assessment', 
    description: 'Complete Bitcoin asset assessment using our structured intake process. Deliverables: Risk exposure audit, technical sophistication assessment, family dynamics evaluation. Tools: Multisig Design Worksheet, Client Assessment Template.'
  },
  { 
    id: 2, 
    name: 'Custody Architecture Design', 
    description: 'Design secure 3-of-5 multisig architecture with appropriate co-signer selection. Deliverables: Custody design document, co-signer agreements, security protocols. Tools: Governance Playbook, Technical Implementation Guide.'
  },
  { 
    id: 3, 
    name: 'Legal Document Drafting', 
    description: 'Draft Bitcoin-specific trust provisions and estate documents. Deliverables: Trust amendments, will provisions, beneficiary forms. Tools: Enhanced Templates, Clause Library, State Law Riders.'
  },
  { 
    id: 4, 
    name: 'Custody Solution Implementation', 
    description: 'Build secure multisig vaults and establish key ceremonies. Deliverables: Configured hardware wallets, key shard distribution, backup protocols. Tools: Hardware Security Guide, Key Ceremony Checklist.'
  },
  { 
    id: 5, 
    name: 'Plan Delivery & Review', 
    description: 'Present comprehensive Bitcoin estate plan with technical demonstrations. Deliverables: Complete plan binder, access instructions, emergency protocols. Tools: Client Presentation Template, Delivery Checklist.'
  },
  { 
    id: 6, 
    name: 'Beneficiary Education Program', 
    description: 'Train beneficiaries on Bitcoin custody and inheritance procedures. Deliverables: Training documentation, technical guides, practice transactions. Tools: Education Modules, Technical Workshops.'
  },
  { 
    id: 7, 
    name: 'Security Key Rotation', 
    description: 'Execute periodic key rotation and security audits for ongoing protection. Deliverables: New key sets, updated access instructions, audit reports. Tools: Rotation Protocol, Security Audit Template.'
  },
  { 
    id: 8, 
    name: 'Regulatory Compliance Review', 
    description: 'Monitor evolving Bitcoin regulations and update plans accordingly. Deliverables: Compliance assessments, regulatory updates, amended documents. Tools: Compliance Tracker, Regulatory Alert System.'
  },
  { 
    id: 9, 
    name: 'Documentation & Record Keeping', 
    description: 'Maintain comprehensive records of all Bitcoin custody arrangements. Deliverables: Transaction logs, custody verification, audit trails. Tools: Documentation System, Record Management Protocol.'
  },
  { 
    id: 10, 
    name: 'Ongoing Plan Maintenance', 
    description: 'Provide continuous monitoring and updates to Bitcoin estate plans. Deliverables: Annual reviews, value assessments, strategy adjustments. Tools: Maintenance Schedule, Update Protocols.'
  },
]

export default function SOPPage() {
  const [selectedPhase, setSelectedPhase] = useState(1)

  return (
    <>
      <motion.div 
        className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">KEEP Implementation SOP</h1>
          <p className="text-muted-foreground">
            Follow the 10-phase framework for Bitcoin estate planning excellence.
          </p>
        </motion.div>

        {/* Phase Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between overflow-x-auto mb-4">
              {phases.map((phase) => (
                <motion.button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className="flex flex-col items-center group min-w-[80px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all
                      ${selectedPhase === phase.id 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                      }
                    `}
                    animate={{
                      scale: selectedPhase === phase.id ? 1.1 : 1,
                    }}
                  >
                    {phase.id}
                  </motion.div>
                  <span className="text-xs mt-2 text-muted-foreground hidden lg:block">
                    {phase.name}
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div 
                className="bg-primary h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(selectedPhase / phases.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Phase {selectedPhase}: {phases.find(p => p.id === selectedPhase)?.name}
                </CardTitle>
                <p className="text-muted-foreground">
                  {phases.find(p => p.id === selectedPhase)?.description}
                </p>
              </CardHeader>
              <CardContent>

              {/* Tabs */}
              <Tabs.Root defaultValue="description" className="w-full">
                <Tabs.List className="flex border-b border-secondary-200">
                  <Tabs.Trigger 
                    value="description" 
                    className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all"
                  >
                    Description
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="tools" 
                    className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all"
                  >
                    Tools
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="checklist" 
                    className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all"
                  >
                    Checklist
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="faqs" 
                    className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700 data-[state=active]:text-primary-600 data-[state=active]:border-b-2 data-[state=active]:border-primary-600 transition-all"
                  >
                    FAQs
                  </Tabs.Trigger>
                </Tabs.List>

                <div className="mt-6 min-h-[300px]">
                  <Tabs.Content value="description" className="animate-fadeIn">
                    <div className="prose max-w-none">
                      <p className="text-secondary-700">
                        This phase involves comprehensive assessment of the client's Bitcoin holdings,
                        including wallet types, custody arrangements, and access procedures. The attorney
                        must gather detailed information about the client's cryptocurrency portfolio
                        while maintaining appropriate security protocols.
                      </p>
                      <h3 className="text-lg font-semibold mt-4 mb-2">Key Objectives:</h3>
                      <ul className="list-disc pl-5 space-y-2 text-secondary-700">
                        <li>Assess total Bitcoin holdings and storage methods</li>
                        <li>Evaluate current security measures</li>
                        <li>Identify estate planning objectives</li>
                        <li>Document beneficiary information</li>
                      </ul>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="tools" className="animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        className="p-4 bg-secondary-50 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h4 className="font-semibold text-secondary-900 mb-2">Client Intake Form</h4>
                        <p className="text-sm text-secondary-600 mb-3">
                          Comprehensive questionnaire for Bitcoin holdings assessment
                        </p>
                        <button className="btn-secondary text-sm">Download Template</button>
                      </motion.div>
                      <motion.div 
                        className="p-4 bg-secondary-50 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h4 className="font-semibold text-secondary-900 mb-2">Risk Assessment Tool</h4>
                        <p className="text-sm text-secondary-600 mb-3">
                          Evaluate security risks and custody arrangements
                        </p>
                        <button className="btn-secondary text-sm">Access Tool</button>
                      </motion.div>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="checklist" className="animate-fadeIn">
                    <div className="space-y-3">
                      {[
                        'Complete client intake questionnaire',
                        'Document all Bitcoin wallet addresses',
                        'Verify custody arrangements',
                        'Assess technical competence of beneficiaries',
                        'Review existing estate planning documents',
                      ].map((item, index) => (
                        <motion.label 
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <input type="checkbox" className="mt-1 mr-3" />
                          <span className="text-secondary-700">{item}</span>
                        </motion.label>
                      ))}
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="faqs" className="animate-fadeIn">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-2">
                          How detailed should the Bitcoin holdings assessment be?
                        </h4>
                        <p className="text-secondary-700">
                          The assessment should include all Bitcoin holdings, wallet types, custody providers,
                          and approximate values. However, private keys should never be collected or stored
                          by the attorney.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-2">
                          What if the client uses multiple custody solutions?
                        </h4>
                        <p className="text-secondary-700">
                          Document each custody arrangement separately, including any multi-signature setups,
                          hardware wallets, and institutional custody providers. This complexity should be
                          reflected in the estate planning strategy.
                        </p>
                      </div>
                    </div>
                  </Tabs.Content>
                </div>
              </Tabs.Root>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-secondary-200">
                <motion.button 
                  className="btn-secondary flex items-center"
                  disabled={selectedPhase === 1}
                  onClick={() => setSelectedPhase(selectedPhase - 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  Previous Phase
                </motion.button>
                <motion.button 
                  className="btn-primary flex items-center"
                  disabled={selectedPhase === 10}
                  onClick={() => setSelectedPhase(selectedPhase + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Phase
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
    </>
  )
}