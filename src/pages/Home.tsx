export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Profile Picture */}
        <div className="mb-6">
          <img
            src="/kheepo-profile.jpg"
            alt="Kheepo Motsinoi Profile Picture"
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-indigo-200 shadow-lg"
          />
        </div>
        
        {/* Name and Surname */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kheepo Motsinoi
          </h1>
          <p className="text-lg text-gray-600">
            Software Developer
          </p>
        </div>
        
        {/* Additional Info */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-500 text-sm">
            Welcome to my personal profile page
          </p>
        </div>
      </div>
    </div>
  );
}