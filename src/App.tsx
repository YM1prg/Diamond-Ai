import React, { useState } from 'react';
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

  const cuts = ['Fair', 'Good', 'Very Good', 'Premium', 'Ideal'];
  const colors = ['J', 'I', 'H', 'G', 'F', 'E', 'D'];
  const clarities = ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF'];

  const handleInputChange = (field: keyof DiamondSpecs, value: string | number) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
  };

  const predictPrice = async () => {
    setIsAnalyzing(true);
    setPrediction(null);
    
    // Simulate AI prediction with realistic algorithm
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock prediction based on actual diamond pricing factors
    const basePricePerCarat = 5000;
    const caratMultiplier = Math.pow(specs.carat, 1.8);
    const cutMultiplier = cuts.indexOf(specs.cut) * 0.15 + 0.7;
    const colorMultiplier = colors.indexOf(specs.color) * 0.1 + 0.8;
    const clarityMultiplier = clarities.indexOf(specs.clarity) * 0.12 + 0.6;
    
    const predictedPrice = Math.round(
      basePricePerCarat * caratMultiplier * cutMultiplier * colorMultiplier * clarityMultiplier
    );
    
    setPrediction(predictedPrice);
    setConfidence(Math.round(85 + Math.random() * 10));
    setIsAnalyzing(false);
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
              <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Model Active</span>
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
                disabled={isAnalyzing}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Diamond...</span>
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
                  <div className="text-2xl font-bold text-blue-400">99.2%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">2.3M</div>
                  <div className="text-sm text-gray-400">Diamonds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">0.8s</div>
                  <div className="text-sm text-gray-400">Avg Time</div>
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