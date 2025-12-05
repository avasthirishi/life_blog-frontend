import { FaFacebook, FaYoutube, FaInstagram, FaTiktok, FaPinterest, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-6 gap-8 text-sm">
        <div>
          <h3 className="font-bold mb-2">Product</h3>
          <ul className="space-y-1">
            <li>Website Templates</li>
            <li>Website Builder</li>
            <li>Website Design</li>
            <li>Wix Features</li>
            <li>App Market</li>
            <li>Web Hosting</li>
            <li>Domain Names</li>
            <li>Website Accessibility</li>
            <li>Mobile App Builder</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Solutions</h3>
          <ul className="space-y-1">
            <li>Online Store</li>
            <li>Online Booking</li>
            <li>Restaurant Website</li>
            <li>Blog Website</li>
            <li>Portfolio Website</li>
            <li>Ecommerce Website</li>
            <li>Wix Studio</li>
            <li>Enterprise Solutions</li>
            <li>Student Website</li>
            <li>Professional Tools</li>
            <li>Logo Maker</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Learn</h3>
          <ul className="space-y-1">
            <li>Wix Blog</li>
            <li>Privacy and Security Hub</li>
            <li>SEO Learning Hub</li>
            <li>Wix Encyclopedia</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Support</h3>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Hire a Professional</li>
            <li>Report Abuse</li>
            <li>System Status</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Company</h3>
          <ul className="space-y-1">
            <li>Channel Partnerships</li>
            <li>Press & Media</li>
            <li>Investor Relations</li>
            <li>Wix Capital</li>
            <li>Accessibility Statement</li>
            <li>Patent Notice</li>
            <li>Sitemap</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">LifeBlog</h3>
          <p className="mb-2 text-gray-600 dark:text-gray-400">
            LifeBlog offers a complete solution for sharing your thoughts and stories. Advanced SEO and marketing tools help you grow online.
          </p>
          <ul className="space-y-1">
            <li>About</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="flex space-x-4 mb-2 md:mb-0">
          <FaFacebook className="w-5 h-5" />
          <FaYoutube className="w-5 h-5" />
          <FaInstagram className="w-5 h-5" />
          <FaTiktok className="w-5 h-5" />
          <FaPinterest className="w-5 h-5" />
          <FaLinkedin className="w-5 h-5" />
        </div>
        <div className="flex space-x-4 text-xs text-gray-500">
          <span>Terms of Use</span>
          <span>Privacy Policy</span>
        </div>
        <div className="text-xs text-gray-500 mt-2 md:mt-0">
          © 2025 LifeBlog, Inc
        </div>
      </div>
    </footer>
  )
}