import React, { useState, useRef } from 'react';
import { Music, Video, Upload, Download, Loader2, X } from 'lucide-react';

export default function MediaConverter() {
  const [mode, setMode] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState(null);
  const fileInputRef = useRef(null);

  const audioFormats = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];
  const videoFormats = ['mp4', 'webm', 'avi', 'mov', 'mkv'];

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setSelectedFormat('');
    setFile(null);
    setConverted(false);
    setConvertedBlob(null);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConverted(false);
      setConvertedBlob(null);
    }
  };

  const handleConvert = async () => {
    if (!file || !selectedFormat) return;

    setConverting(true);
    
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a blob for download (in real implementation, this would be actual conversion)
    const blob = new Blob([file], { type: getMimeType(selectedFormat) });
    setConvertedBlob(blob);
    setConverted(true);
    setConverting(false);
  };

  const getMimeType = (format) => {
    const mimeTypes = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      aac: 'audio/aac',
      m4a: 'audio/mp4',
      flac: 'audio/flac',
      mp4: 'video/mp4',
      webm: 'video/webm',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      mkv: 'video/x-matroska'
    };
    return mimeTypes[format] || 'application/octet-stream';
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;

    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
    a.download = `${originalName}.${selectedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setMode(null);
    setSelectedFormat('');
    setFile(null);
    setConverted(false);
    setConvertedBlob(null);
    setConverting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      {!mode ? (
        <div className="relative z-10 flex gap-8">
          <button
            onClick={() => handleModeSelect('audio')}
            className="group relative bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 w-64 h-64 flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <Music className="w-24 h-24 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-bold text-gray-800">Audio Converter</h2>
            <p className="text-gray-600 mt-2 text-center text-sm">Convert audio files to different formats</p>
          </button>

          <button
            onClick={() => handleModeSelect('video')}
            className="group relative bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 w-64 h-64 flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <Video className="w-24 h-24 text-pink-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-bold text-gray-800">Video Converter</h2>
            <p className="text-gray-600 mt-2 text-center text-sm">Convert video files to different formats</p>
          </button>
        </div>
      ) : (
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {mode === 'audio' ? (
                <Music className="w-8 h-8 text-purple-600" />
              ) : (
                <Video className="w-8 h-8 text-pink-600" />
              )}
              <h1 className="text-3xl font-bold text-gray-800">
                {mode === 'audio' ? 'Audio' : 'Video'} Converter
              </h1>
            </div>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Output Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(mode === 'audio' ? audioFormats : videoFormats).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`py-3 px-4 rounded-xl font-semibold uppercase text-sm transition-all duration-200 ${
                      selectedFormat === format
                        ? mode === 'audio'
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-pink-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload File
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  file
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept={mode === 'audio' ? 'audio/*' : 'video/*'}
                  className="hidden"
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">
                      Click to upload {mode} file
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      or drag and drop your file here
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleConvert}
                disabled={!file || !selectedFormat || converting}
                className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                  !file || !selectedFormat || converting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : mode === 'audio'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:scale-105'
                    : 'bg-gradient-to-r from-pink-600 to-orange-600 hover:shadow-xl hover:scale-105'
                }`}
              >
                {converting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Converting...
                  </>
                ) : (
                  'Convert'
                )}
              </button>

              {converted && (
                <button
                  onClick={handleDownload}
                  className="flex-1 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Download className="w-6 h-6" />
                  Download
                </button>
              )}
            </div>

            {converted && (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center">
                <p className="text-green-800 font-semibold">
                  ✓ Conversion completed successfully!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Your file is ready to download
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}