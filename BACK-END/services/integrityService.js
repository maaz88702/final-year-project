const mongoose = require("mongoose");

/**
 * Updates a student's submission record with its AI & Plagiarism scanning metrics.
 */
const updateSubmissionIntegrity = async (submissionId, aiScore, plagiarismScore) => {
  try {
    await mongoose.model("AssignmentSubmitted").findByIdAndUpdate(submissionId, {
      detectionStatus: "completed",
      aiPercentage: aiScore || 0,
      plagiarismPercentage: plagiarismScore || 0
    });
    console.log(`✅ Integrity metrics updated for submission: ${submissionId}`);
  } catch (error) {
    console.error("❌ Failed to update integrity metrics:", error.message);
    await mongoose.model("AssignmentSubmitted").findByIdAndUpdate(submissionId, {
      detectionStatus: "failed"
    });
  }
};

// Export it so other controllers can use it
module.exports = {
  updateSubmissionIntegrity
};