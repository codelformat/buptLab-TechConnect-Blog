export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* The main card container */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Left side with contact information and gradient background */}
        <div className="p-8 md:w-1/3 w-full glowing-gradient flex flex-col justify-between text-white">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-md mb-8">Say something to start a live chat!</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-phone-alt"></i>
                <span>+1012 3456 789</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-envelope"></i>
                <span>demo@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-map-marker-alt"></i>
                <span>132 Dartmouth Street Boston, Massachusetts 02156 United States</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-8">
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-discord"></i>
          </div>
        </div>

        {/* Right side with blog information */}
        <div className="p-8 md:w-2/3 w-full flex flex-col justify-center border-l-2 border-gray-300 shadow-lg">
          <h1 className="text-3xl font-semibold text-center mb-7">About Sahand's Blog</h1>
          <div className="text-md text-gray-700 space-y-6">
            <p>
              Welcome to Sahand's Blog! This blog was created by Sahand Ghavidel
              as a personal project to share his thoughts and ideas with the
              world. Sahand is a passionate developer who loves to write about
              technology, coding, and everything in between.
            </p>
            <p>
              On this blog, you'll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages. Sahand is always learning and exploring new
              technologies, so be sure to check back often for new content!
            </p>
            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
