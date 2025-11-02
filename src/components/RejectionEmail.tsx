import { motion } from 'motion/react';

interface RejectionEmailProps {
  company: string;
  reason: string;
  show: boolean;
}

export function RejectionEmail({ company, reason, show }: RejectionEmailProps) {
  if (!show) return null;

  const getCompanyEmail = (companyName: string) => {
    return `noreply@${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Email Header */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 border-b-2 border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
              📧
            </div>
            <div>
              <p className="text-sm text-gray-600">From: {getCompanyEmail(company)}</p>
              <p className="text-sm text-gray-600">To: you@vit.ac.in</p>
            </div>
          </div>
          <h3 className="text-xl">Subject: Application Status Update - Position Filled</h3>
        </div>

        {/* Email Body */}
        <div className="p-6 bg-white">
          <p className="mb-4">Dear Candidate,</p>
          
          <p className="mb-4">
            Thank you for your interest in the <strong>{company}</strong> recruitment process at VIT.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">
              <strong>Unfortunately, we regret to inform you that your application has not been shortlisted.</strong>
            </p>
            <p className="text-red-600 mt-2 text-sm">
              Reason: <strong>{reason}</strong>
            </p>
          </div>

          <p className="mb-4 text-gray-700">
            We received an overwhelming response with over <strong>10,000+ applications</strong> for limited positions. 
            The selection process was highly competitive, and we had to make difficult decisions.
          </p>

          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="text-sm text-gray-600 italic">
              "We encourage you to keep applying to other companies. Your VIT degree still has value... we think."
            </p>
          </div>

          <p className="mb-4 text-gray-700">
            We wish you all the best in your future endeavors. Please note that this decision is final and we will not be entertaining any queries regarding the same.
          </p>

          <p className="mb-2">Best Regards,</p>
          <p className="text-gray-700">{company} Recruitment Team</p>
          <p className="text-xs text-gray-500 mt-4">
            This is an automated email. Please do not reply to this message.
          </p>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              © 2024 {company}. All rights reserved. | 
              <span className="ml-1">Placement Cell, VIT Vellore</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
