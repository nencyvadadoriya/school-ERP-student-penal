import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartLine, FaExclamationTriangle, FaLightbulb, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface WeakSubject {
  subject_code: string;
  percentage: string;
  reason: string;
  suggestion: string;
}

interface PredictionData {
  status: string;
  overall_percentage: string;
  weak_subjects: WeakSubject[];
  recommendation: string;
}

const StudentPrediction: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        // Use the same API structure as other student panel services
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/prediction/${studentId}`);
        setPrediction(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No prediction data available yet.');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchPrediction();
    }
  }, [studentId]);

  if (loading) return <div className="p-4 text-center text-xs text-gray-500">Loading prediction...</div>;
  if (error) return null; // Silently fail if no data
  if (!prediction) return null;

  const isPass = prediction.status === 'Pass';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isPass ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            <FaChartLine className="text-lg" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">Academic Prediction</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
          isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isPass ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <span>{prediction.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Expected Score</p>
          <p className="text-xl font-black text-blue-700">{prediction.overall_percentage}%</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center space-x-2 mb-1">
            <FaLightbulb className="text-purple-600 text-xs" />
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Suggestion</p>
          </div>
          <p className="text-xs text-purple-700 font-medium leading-tight">{prediction.recommendation}</p>
        </div>
      </div>

      {prediction.weak_subjects.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-50">
          <h3 className="text-[11px] font-bold text-gray-700 flex items-center space-x-2">
            <FaExclamationTriangle className="text-yellow-500" />
            <span>Improvement Areas</span>
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {prediction.weak_subjects.map((sub) => (
              <div key={sub.subject_code} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">{sub.subject_code}</p>
                  <p className="text-[10px] text-gray-500">{sub.suggestion}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">{sub.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPrediction;
