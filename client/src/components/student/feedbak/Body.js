import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { feedback } from "../../../redux/actions/studentActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Body = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    studentId: "",
    subjectCode: "",
    department: "",
    year: "",
    section: "",
    feedback: "",
    clarityRating: "",
    knowledgeRating: "",
    presentationRating: "",
    helpfulnessRating: "",
    engagementRating: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(feedback(value));
  };

  return (
    <div className="flex-[0.8] min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto rounded-2xl bg-gray-800/50 backdrop-blur-sm shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Submit Feedback
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Student ID</label>
                <input
                  placeholder="Enter your student ID"
                  required
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  type="text"
                  value={value.studentId}
                  onChange={(e) => setValue({ ...value, studentId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Subject Code</label>
                <input
                  required
                  placeholder="Enter subject code"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  type="text"
                  value={value.subjectCode}
                  onChange={(e) => setValue({ ...value, subjectCode: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Department</label>
                <input
                  required
                  placeholder="Enter department"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  type="text"
                  value={value.department}
                  onChange={(e) => setValue({ ...value, department: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Year</label>
                <Select
                  required
                  displayEmpty
                  sx={{ 
                    height: 40, 
                    width: '100%',
                    backgroundColor: 'rgba(55, 65, 81, 0.5)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(75, 85, 99, 0.5)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(59, 130, 246)',
                    },
                  }}
                  value={value.year}
                  onChange={(e) => setValue({ ...value, year: e.target.value })}
                >
                  <MenuItem value="">Select Year</MenuItem>
                  {[1, 2, 3, 4].map((num) => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Section</label>
                <input
                  required
                  placeholder="Enter section"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  type="text"
                  value={value.section}
                  onChange={(e) => setValue({ ...value, section: e.target.value })}
                />
              </div>
            </div>

            {/* Right Column - Ratings */}
            <div className="space-y-6">
              {["Clarity", "Knowledge", "Presentation", "Helpfulness", "Engagement"].map((ratingType) => (
                <div key={ratingType} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">{`${ratingType} Rating`}</label>
                  <Select
                    required
                    displayEmpty
                    sx={{ 
                      height: 40,
                      width: '100%',
                      backgroundColor: 'rgba(55, 65, 81, 0.5)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(75, 85, 99, 0.5)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgb(59, 130, 246)',
                      },
                    }}
                    value={value[`${ratingType.toLowerCase()}Rating`]}
                    onChange={(e) => setValue({
                      ...value,
                      [`${ratingType.toLowerCase()}Rating`]: e.target.value
                    })}
                  >
                    <MenuItem value="">Select Rating</MenuItem>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Custom Feedback</label>
            <textarea
              placeholder="Share your thoughts and feedback..."
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 min-h-[120px] resize-y"
              value={value.feedback}
              onChange={(e) => setValue({ ...value, feedback: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => setValue({
                studentId: "",
                subjectCode: "",
                department: "",
                year: "",
                section: "",
                feedback: "",
                clarityRating: "",
                knowledgeRating: "",
                presentationRating: "",
                helpfulnessRating: "",
                engagementRating: ""
              })}
              className="px-6 py-2.5 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-500/50 transition-all duration-200"
              type="button"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Body;