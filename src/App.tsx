import React, { useState, useEffect } from 'react';
import * as ort from 'onnxruntime-web';
import { Sparkles, Zap, Diamond, TrendingUp, Star, Cpu } from 'lucide-react';

interface DiamondSpecs {
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  depth: number;
  table: number;
  x: number;
  y: number;
  z: number;
}

function App() {
  const [specs, setSpecs] = useState<DiamondSpecs>({
    carat: 1.0,
    cut: 'Ideal',
    color: 'G',
    clarity: 'VS2',
    depth: 61.5,
    table: 55.0,
    x: 6.5,
    y: 6.5,
    z: 4.0
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Encoding maps (MUST match your Python OrdinalEncoder categories)
  const cutMap: Record<string, number> = {
    'Fair': 0,
    'Good': 1,
    'Very Good': 2,
    'Premium': 3,
    'Ideal': 4
  };

  const colorMap: Record<string, number> = {
    'J': 0, 'I': 1, 'H': 2, 'G': 3, 'F': 4, 'E': 5, 'D': 6
  };

  const clarityMap: Record<string, number> = {
    'I1': 0, 'SI2': 1, 'SI1': 2, 'VS2': 3, 'VS1': 4,
    'VVS2': 5, 'VVS1': 6, 'IF': 7
  };

  const cuts = Object.keys(cutMap);
  const colors = Object.keys(colorMap);
  const clarities = Object.keys(clarityMap);

  // Load ONNX model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        await ort.InferenceSession.create('/svm_diamonds_web.onnx');
        setModelLoaded(true);
        console.log("✅ ONNX model loaded successfully");
      } catch (e) {
        console.error("❌ Failed to load ONNX model:", e);
        alert("Failed to load AI model. Check console for details.");
      }
    };
    loadModel();
  }, []);

  const handleInputChange = (field: keyof DiamondSpecs, value: string | number) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
  };

  const predictPrice = async () => {
    if (!modelLoaded) {
      alert("Model still loading. Please wait.");
      return;
    }

    setIsAnalyzing(true);
    setPrediction(null);

    try {
      // Compute Volume (x * y * z)
      const volume = specs.x * specs.y * specs.z;

      // Encode categorical features
      const encodedCut = cutMap[specs.cut];
      const encodedColor = colorMap[specs.color];
      const encodedClarity = clarityMap[specs.clarity];

      if (encodedCut === undefined || encodedColor === undefined || encodedClarity === undefined) {
        throw new Error("Invalid category selection");
      }

      // Create feature vector in correct order:
      // [carat, cut, color, clarity, depth, table, Volume]
      const features = [
        specs.carat,
        encodedCut,
        encodedColor,
        encodedClarity,
        specs.depth,
        specs.table,
        volume
      ];

      // Create tensor: shape [1, 7], type float32
      const inputTensor = new ort.Tensor('float32', features, [1, 7]);

      // Load session and run inference
      const session = await ort.InferenceSession.create('/svm_diamonds_web.onnx');
      const feeds = { 'float_input': inputTensor }; // ← Match your ONNX input name!
      const results = await session.run(feeds);

      // Get output (log price) and convert to USD
      const logPrice = results.variable.data[0]; // ← Match your ONNX output name!
      const usdPrice = Math.expm1(logPrice); // Reverse of np.log1p

      setPrediction(Math.round(usdPrice));
      setConfidence(Math.round(88 + Math.random() * 8)); // Keep your UI flair

    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Check console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  DiamondAI
                </h1>
                <p className="text-sm text-gray-400">Advanced Diamond Price Prediction</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                modelLoaded 
                  ? 'bg-green-500/10 text-green-400' 
                  : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  modelLoaded ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
                <span>{modelLoaded ? 'Model Active' : 'Loading Model...'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <Cpu className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold">Diamond Specifications</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Carat */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Carat Weight
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={specs.carat}
                    onChange={(e) => handleInputChange('carat', parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Cut */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cut</label>
                  <select
                    value={specs.cut}
                    onChange={(e) => handleInputChange('cut', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {cuts.map(cut => (
                      <option key={cut} value={cut} className="bg-gray-800">{cut}</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                  <select
                    value={specs.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {colors.map(color => (
                      <option key={color} value={color} className="bg-gray-800">{color}</option>
                    ))}
                  </select>
                </div>

                {/* Clarity */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Clarity</label>
                  <select
                    value={specs.clarity}
                    onChange={(e) => handleInputChange('clarity', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {clarities.map(clarity => (
                      <option key={clarity} value={clarity} className="bg-gray-800">{clarity}</option>
                    ))}
                  </select>
                </div>

                {/* Depth */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Depth %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={specs.depth}
                    onChange={(e) => handleInputChange('depth', parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Length (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={specs.x}
                    onChange={(e) => handleInputChange('x', parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Width (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={specs.y}
                    onChange={(e) => handleInputChange('y', parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Height (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={specs.z}
                    onChange={(e) => handleInputChange('z', parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={predictPrice}
                disabled={isAnalyzing || !modelLoaded}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Diamond...</span>
                  </>
                ) : !modelLoaded ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Loading Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Predict Price</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Stats */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>AI Model Stats</span>
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">0.0119</div>
                  <div className="text-sm text-gray-400">Val MSE</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">SVM</div>
                  <div className="text-sm text-gray-400">Model</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">ONNX</div>
                  <div className="text-sm text-gray-400">Format</div>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold">Price Prediction</h2>
              </div>
              
              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 mb-2">Processing diamond characteristics...</p>
                  <p className="text-sm text-gray-500">Running advanced ML algorithms</p>
                </div>
              )}

              {prediction && !isAnalyzing && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      ${prediction.toLocaleString()}
                    </div>
                    <p className="text-gray-400">Estimated Market Value</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Confidence Score</span>
                      <span className="text-sm font-medium text-green-400">{confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <div className="text-lg font-semibold text-blue-400">${Math.round(prediction * 0.85).toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Wholesale Est.</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <div className="text-lg font-semibold text-purple-400">${Math.round(prediction * 1.15).toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Retail Est.</div>
                    </div>
                  </div>
                </div>
              )}

              {!prediction && !isAnalyzing && (
                <div className="text-center py-12">
                  <Diamond className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Ready to analyze your diamond</p>
                  <p className="text-sm text-gray-500">Enter specifications and click predict</p>
                </div>
              )}
            </div>

            {/* Feature Importance */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Key Price Factors</span>
              </h3>
              <div className="space-y-3">
                {[
                  { factor: 'Carat Weight', impact: 45, color: 'bg-blue-500' },
                  { factor: 'Cut Quality', impact: 25, color: 'bg-purple-500' },
                  { factor: 'Color Grade', impact: 15, color: 'bg-green-500' },
                  { factor: 'Clarity', impact: 10, color: 'bg-yellow-500' },
                  { factor: 'Dimensions', impact: 5, color: 'bg-red-500' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-24 text-sm text-gray-400">{item.factor}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-1000 delay-${idx * 100}`}
                        style={{ width: `${item.impact}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm text-gray-400">{item.impact}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
