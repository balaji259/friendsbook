import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";

const categories = [
  "Home",
  "Getting Started",
  "Account Settings",
  "Privacy & Security",
  "Posting & Sharing",
  "Friend Connections",
  "Messaging",
  "Troubleshooting",
  "Community Standards",
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState("Home");
  const navigate=useNavigate();

useEffect(()=>
{
  console.log(activeCategory);
},[activeCategory])

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      {/* Header */}
      <header className="bg-[#3b5998] text-white p-3 flex items-center justify-between px-6">
        <h1 className="text-lg font-bold">Friendsbook</h1>
        {/* <input
          type="text"
          placeholder="Search help topics..."
          className="p-1 text-sm border rounded w-64"
        /> */}
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-4 flex flex-col md:flex-row bg-white border shadow-md">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 border-r p-4 bg-gray-50">
          <h2 className="font-bold text-[#3b5998] mb-2">Help Categories</h2>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer p-2 text-sm rounded transition-colors ${
                  activeCategory === category ? "bg-[#3b5998] text-white font-bold" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Section */}
        <main className="flex-1 p-6">
          <h2 className="text-lg font-semibold text-[#3b5998]">Friendsbook Help Center</h2>
          <p className="text-sm text-gray-700">Home</p>
          <div className="mt-4 text-sm">
            <p className="font-bold">Welcome to the Friendsbook Help Center!</p>
            <p>Here you'll find answers to common questions about using Friendsbook.</p>
            <p className="mt-2">Choose a category from the menu on the left to get started.</p>
          </div>
          
          {/* Help Topics */}
          <section className="mt-6 bg-white p-4 rounded">
            <h3 className="font-bold text-[#3b5998]">Popular Help Topics</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-[#3b5998]">
              <li><a href="#" className="text-blue-700 hover:underline" onClick={()=>setActiveCategory("Account Settings")}>How to change your password</a></li>
              <li><a href="#" className="text-blue-700 hover:underline" onClick={()=>setActiveCategory("Privacy & Security")}>Privacy settings and controls</a></li>
              <li><a href="#" className="text-blue-700 hover:underline" onClick={()=>setActiveCategory("Friend Connections")}>Finding and adding friends</a></li>
              <li><a href="#" className="text-blue-700 hover:underline" onClick={()=>setActiveCategory("Posting & Sharing")}>Sharing photos and videos</a></li>
              <li><a href="#" className="text-blue-700 hover:underline" onClick={()=>setActiveCategory("Troubleshooting")}>Account login problems</a></li>
            </ul>
          </section>
          
          {/* Contact Support */}
          <div className="mt-6 bg-gray-200 p-4 text-center rounded">
            <p className="text-sm">Need more help with Friendsbook?</p>
            <button className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}
>
              Contact Support
            </button>
          </div>

          {/* Getting Started Section */}
          {activeCategory === "Getting Started" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Getting Started with Friendsbook</h3>
              <p className="text-sm text-gray-700">Home &gt; Getting Started</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">How do I create a Friendsbook account?</h4>
                <p>
                  To create a Friendsbook account, visit our homepage at friendsbook.online and click "Sign Up". 
                  You'll need to provide your name, email or phone number, password, birthday, and gender. Follow the prompts to complete your profile setup.
                </p>
                
                <h4 className="font-bold mt-4">What information do I need to sign up?</h4>
                <p>
                  You'll need to enter your full name, email address or mobile phone number, a secure password, 
                  date of birth, and gender. We use this information to help secure your account and personalize your experience.
                </p>
                
                <h4 className="font-bold mt-4">Is Friendsbook free to use?</h4>
                <p>
                  Yes, Friendsbook is completely free to use. We generate revenue through advertising tailored to your interests, 
                  but all core features and functionalities will always remain free to use.
                </p>
                
                <h4 className="font-bold mt-4">How do I set up my profile?</h4>
                <p>
                  Once you create an account, you can add a profile picture, basic information, and other personal details. 
                  Go to your profile page and click "Edit Profile" to update your information. A complete profile helps build connections faster.
                </p>
              </div>
              
              {/* Contact Support */}
              <div className="mt-6 bg-gray-200 p-4 text-center rounded">
                <p className="text-sm">Still need help getting started?</p>
                <button  className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}
>
                  Contact Support
                </button>
              </div>
            </section>
          )}



          {/* Account Settings Section */}
          {activeCategory === "Account Settings" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Account Settings</h3>
              <p className="text-sm text-gray-700">Home &gt; Account Settings</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">How do I change my password?</h4>
                <p>
                  To change your password, go to Account Settings &gt; Change Password. You'll need to enter your current password first, then enter and confirm your new password.
                  We recommend using a strong, unique password for your Friendsbook account.
                </p>
                
                <h4 className="font-bold mt-4">How do I update my email address?</h4>
                <p>
                  Go to Account Settings &gt; Contact Information. Click "Change Email" and follow the verification process. We'll send a confirmation link to your new email address
                  to verify ownership before the change is complete.
                </p>
                
                <h4 className="font-bold mt-4">Can I change my username or name?</h4>
                <p>
                  Go to Account Settings &gt; Name. You can change your name, but there are limits to how often you can do this. We recommend using your real name to help friends find you,
                  but you can use any name as your username.
                </p>
                
                <h4 className="font-bold mt-4">How do I deactivate or delete my account?</h4>
                <p>
                  Go to Account Settings &gt; Deactivate Account. You can choose to temporarily deactivate your account or permanently delete it. Deactivation hides your profile but preserves your data if you decide to return later.
                  Deletion permanently removes all your information after a 14-day grace period.
                </p>
              </div>
            </section>
          )}

{activeCategory === "Privacy & Security" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Privacy & Security</h3>
              <p className="text-sm text-gray-700">Home &gt; Privacy & Security</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">Who can see my posts?</h4>
                <p>
                  You can control who sees your posts through your Privacy Settings. Options include Everyone, Friends,
                  Friends of Friends, or Only You. You can set a default for all future posts or choose the audience for
                  each post.
                </p>
                
                <h4 className="font-bold mt-4">How do I make my profile more private?</h4>
                <p>
                  Go to Privacy Settings and adjust who can see your future posts, send you friend requests, and look you
                  up using your email address or phone number. You can also limit the audience for past posts you've
                  shared.
                </p>
                
                <h4 className="font-bold mt-4">Can I control who sends me friend requests?</h4>
                <p>
                  Yes. Go to Privacy Settings &gt; Who can contact me. You can adjust who can send you friend requests:
                  Everyone or Friends of Friends. You can also manage who can message you.
                </p>
                
                <h4 className="font-bold mt-4">How do I block someone?</h4>
                <p>
                  Visit the profile of the person you want to block, click the "Block this person" link at the bottom of
                  their profile. Blocked people cannot see your profile, posts, or contact you. They won’t be notified
                  when you block them.
                </p>
              </div>
              
              <div className="mt-6 bg-gray-200 p-4 text-center rounded">
                <p className="text-sm">Need help with privacy or security?</p>
                <button className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}
>
                  Contact Support
                </button>
              </div>
            </section>
          )}

           {/* Posting & Sharing Section */}
           {activeCategory === "Posting & Sharing" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Posting & Sharing</h3>
              <p className="text-sm text-gray-700">Home &gt; Posting & Sharing</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">How do I create a post?</h4>
                <p>
                  Click on "What's on your mind?" at the top of your profile or homepage. You can add text, photos, videos, 
                  and tag friends. Select your privacy setting using the dropdown menu before posting to control who can 
                  see your content.
                </p>
                
                <h4 className="font-bold mt-4">Can I edit a post after publishing it?</h4>
                <p>
                  Currently, you cannot edit posts after publishing. If you need to change something, you'll need to delete 
                  the post and create a new one. You can delete a post by clicking the "X" at the top when you hover over 
                  the post.
                </p>
                
                <h4 className="font-bold mt-4">How do I share photos?</h4>
                <p>
                  Click "Add Photo" when creating a post, or go to your profile and click on the Photos tab to upload directly 
                  to an album. You can upload individual pictures or create albums for groups of related pictures. 
                  Remember to adjust privacy settings for each upload.
                </p>
                
                <h4 className="font-bold mt-4">What types of content are not allowed on Friendsbook?</h4>
                <p>
                  Friendsbook prohibits content that is illegal, fraudulent, discriminatory, threatening, or contains hate 
                  speech. We also remove content that violates intellectual property rights, promotes self-harm, or displays 
                  graphic violence. Please review our Community Standards for complete guidelines.
                </p>
              </div>
              
              <div className="mt-6 bg-gray-200 p-4 text-center rounded">
                <p className="text-sm">Need help with posting or sharing?</p>
                <button className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}
>
                  Contact Support
                </button>
              </div>
            </section>
          )}

             {/* Friend Connections Section */}
             {activeCategory === "Friend Connections" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Friend Connections</h3>
              <p className="text-sm text-gray-700">Home &gt; Friend Connections</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">How do I find and add friends?</h4>
                <p>
                  You can find friends using the search bar, browse people from your school or workplace, or import email contacts. When you find someone you know, click "Add a Friend." They need to accept your request before you become friends on Friendsbook.
                </p>
                
                <h4 className="font-bold mt-4">How do I respond to friend requests?</h4>
                <p>
                  Click the friend request icon at the top of any Friendsbook page to see your pending requests. You can choose to confirm or ignore each request. If you’re not sure about a request, you can click "Not Now" to decide later.
                </p>
                
                <h4 className="font-bold mt-4">How do I unfriend someone?</h4>
                <p>
                  To unfriend someone, go to their profile, hover over the "Friends" button, and select "Remove from Friends." The person won’t be notified when this happens, but they may notice when they can’t see your friends-only content anymore.
                </p>
                
                <h4 className="font-bold mt-4">What are Friend Lists and how do I use them?</h4>
                <p>
                  Friend Lists help you organize friends and customize who sees your posts. Go to the Friends page, click "Create a List," and add friends to lists like "Close Friends," "Family," or create your own categories. You can then choose specific lists when sharing content.
                </p>
              </div>
              
              <div className="mt-6 bg-gray-200 p-4 text-center rounded">
                <p className="text-sm">Need help with friend connections?</p>
                <button className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}>
                  Contact Support
                </button>
              </div>
            </section>
          )}

            
          {/* Messaging Section */}
          {activeCategory === "Messaging" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Messaging</h3>
              <p className="text-sm text-gray-700">Home &gt; Messaging</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">How do I send a Private message?</h4>
                <p>
                Click on the Messages icon at the top of any Friendsbook page, then click "New Message". Enter the name(s) of the person or people you want to message, type your message, and press Enter to send it.   
                 </p>

                <h4 className="font-bold mt-4">Can I send messages to people who aren't my friends?</h4>
                <p>
                Messages from people who aren't your friends will go to your "Other" folder instead of your inbox. You can adjust who can message you in your Privacy Settings. If you message someone who isn't your friend, they may not see it right away.
                </p>

                <h4 className="font-bold mt-4">How do I know if someone has read my message?</h4>
                <p>
                Currently, Friendsbook does not show read receipts for messages. You won't be able to tell if someone has seen your message until they respond.
                 </p>

                 <h4 className="font-bold mt-4">How do I delete a message?</h4>
                <p>
                To delete a message, hover over it in your inbox and click the "X" that appears. Note that this only removes the message from your view - the recipient will still have their copy of the conversation.
                </p>

              </div>
              <div className="mt-6 bg-gray-200 p-4 text-center rounded">
                <p className="text-sm">Still need help?</p>
                <button className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}>
                  Contact Support
                </button>
              </div>
            </section>
          )}

           {/* Troubleshooting Section */}
           {activeCategory === "Troubleshooting" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Troubleshooting</h3>
              <p className="text-sm text-gray-700">Home &gt; Troubleshooting</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">I forgot my password. How do I reset it?</h4>
                <p>
                  On the login page, click "Forgot your password?" and follow the instructions. You'll need access to the email address or phone number associated with your account to reset your password.
                </p>

                <h4 className="font-bold mt-4">Why can't I log in to my account?</h4>
                <p>
                  Make sure you're using the correct email/phone and password combination. Check if Caps Lock is on. If you still can't log in, try the "Forgot your password?" option. If that doesn't work, your account may have been temporarily locked for security reasons.
                </p>

                <h4 className="font-bold mt-4">Why was my post removed?</h4>
                <p>
                  Posts that violate our Community Standards are removed. This includes content that contains hate speech, bullying, harassment, graphic violence, nudity, or spam. If you believe your post was removed in error, you can appeal the decision through the notification you received.
                </p>

                <h4 className="font-bold mt-4">How do I report a problem with Friendsbook?</h4>
                <p>
                  Click on the "Help" link at the bottom of any Friendsbook page, then select "Report a Problem." Choose the type of issue you're experiencing and provide as much detail as possible to help us resolve it quickly.
                </p>
              </div>
              <div className="mt-6 bg-gray-200 p-4 text-center rounded">
                <p className="text-sm">Still having problems?</p>
                <button className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}>
                  Contact Support
                </button>
              </div>
            </section>
          )}
          

            {/* Community Standards Section */}
            {activeCategory === "Community Standards" && (
            <section className="mt-6 bg-gray-100 p-4 rounded border">
              <h3 className="font-bold text-[#3b5998]">Community Standards</h3>
              <p className="text-sm text-gray-700">Home &gt; Community Standards</p>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">What are Friendsbook’s Community Standards?</h4>
                <p>
                  Our Community Standards outline what is and isn’t allowed on Friendsbook. They’re designed to create a safe environment where people can express themselves. Key areas include violence and criminal behavior, safety, objectionable content, integrity and authenticity, and respecting intellectual property.
                </p>

                <h4 className="font-bold mt-4">How do I report content that violates Community Standards?</h4>
                <p>
                  Click the "Report" link near the content you want to report. Follow the prompts to select the type of violation. Reports are confidential, and the person you report won’t know who reported them.
                </p>

                <h4 className="font-bold mt-4">What happens when I report something?</h4>
                <p>
                  Our team reviews reported content to determine if it violates our Community Standards. If it does, we’ll remove it. In some cases, we may also disable the account that posted it. You’ll be notified of the outcome of your report.
                </p>

                <h4 className="font-bold mt-4">Can I appeal if my content is removed?</h4>
                <p>
                  Yes. If your content is removed, you’ll receive a notification with an option to appeal. We’ll review your appeal and restore your content if we determine it doesn’t violate our standards.
                </p>
              </div>
              <div className="mt-6 bg-gray-200 p-4 text-center rounded">
                <p className="text-sm">Have questions about our Community Standards?</p>
                <button className="bg-[#3b5998] text-white text-sm px-4 py-1 mt-2 rounded hover:bg-[#3b5998]" onClick={() => { navigate('/contact') }}>
                  Contact Support
                </button>
              </div>
            </section>
          )}



        </main>
      </div>

      {/* Footer */}
      <footer className="text-xs text-gray-600 text-center py-4 border-t mt-4">
        &copy; 2025 Friendsbook.online | <a href="#" className="hover:underline">Terms of Service</a> | <a href="#" className="hover:underline">Privacy Policy</a> | <a href="#" className="hover:underline" onClick={()=>{navigate("/about")}}>About</a> | <a href="#" className="hover:underline" onClick={()=>{navigate("/contact")}}>Help</a>
      </footer>
    </div>
  );
}
