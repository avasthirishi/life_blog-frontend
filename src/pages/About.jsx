import React from "react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="bg-blue-100 text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to <span className="font-semibold">Life Blog</span> — a place
          to share stories, ideas, and inspiration that spark meaningful
          conversations.
        </p>
      </section>

      {/* About Content */}
      <section className="flex flex-col md:flex-row items-center justify-center py-16 px-8 gap-10">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="About us"
          className="w-full md:w-1/2 rounded-2xl shadow-lg"
        />
        <div className="md:w-1/2 text-left">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Life Blog started with a simple idea: to create a space where
            everyone’s voice can be heard. Whether it’s lifestyle tips,
            technology insights, travel experiences, or personal reflections —
            we believe in the power of words to inspire and connect people.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to empower creators and readers to engage in
            meaningful conversations and build a community around shared
            knowledge and experiences.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Team Member 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <img
              src="https://avatars.githubusercontent.com/u/163458678?v=4"
              alt="Author"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">Rishikesh Awasthi</h3>
            <p className="text-gray-500">Founder & Developer</p>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQE6g1edGhpZ8A/profile-displayphoto-shrink_800_800/B56ZdUG5bvGQAg-/0/1749462784932?e=1761177600&v=beta&t=ScGRBNYFawS4kuyHrjtWsqb58QGKEVeNxK8E_04BNjQ"
              alt="Author"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">Ankush Mahajan</h3>
            <p className="text-gray-500">Content Strategist</p>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQE9C_m-83J2Zg/profile-displayphoto-shrink_800_800/B56ZRUJdkdHoAc-/0/1736578555315?e=1761177600&v=beta&t=XN3tI9qMAFA_cEnQkqD9tN5abIVvepEZ_y07MChqO0E"
              alt="Author"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">Tarun Bansal</h3>
            <p className="text-gray-500">Editor</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start your blogging journey?
        </h2>
        <p className="mb-6 text-lg">
          Join Life Blog today and share your story with the world.
        </p>
        <a
          href="/"
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Start Blogging
        </a>
      </section>
    </div>
  );
};

export default About;
