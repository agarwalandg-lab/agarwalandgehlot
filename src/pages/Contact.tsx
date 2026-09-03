export default function Contact() {
  return (
    <div className="w-full pt-32 pb-24 min-h-screen flex flex-col justify-center">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-display mb-6">Contact Us</h1>
            <p className="text-muted text-lg leading-relaxed mb-8">
              Your journey toward securing a premium property begins here. Whether you are looking to acquire a luxury residence, invest in a commercial hub, or seek expert advisory, our team of dedicated professionals is ready to assist you.
            </p>
            
            <div className="bg-surface p-8 rounded-3xl border border-stroke mb-8">
              <h3 className="text-2xl font-display mb-4 text-text-primary">Consultation Message</h3>
              <p className="text-muted text-sm leading-relaxed">
                We invite you to experience real estate advisory at its finest. Connect with us for a highly confidential, personalized consultation to discuss your specific requirements and explore exclusive opportunities tailored to your ambitions.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-stroke">
              <h3 className="text-2xl font-display mb-4 text-text-primary">Office Visit Message</h3>
              <p className="text-muted text-sm leading-relaxed">
                We look forward to welcoming you. Visit our corporate office for a private discussion over coffee, and let us map out the perfect real estate strategy for your future.
              </p>
            </div>
          </div>

          <div className="bg-surface border border-stroke rounded-3xl p-8 md:p-12 flex flex-col">
            <h2 className="text-3xl font-display mb-2">Speak with an Expert Today</h2>
            <p className="text-muted text-sm mb-8">Fill out the form below and our advisors will reach out to you shortly.</p>
            
            <form className="flex flex-col gap-6 flex-1">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">Full Name</label>
                <input type="text" className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors" placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">Email Address</label>
                <input type="email" className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors" placeholder="john@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">Phone Number</label>
                <input type="tel" className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors" placeholder="+91 98765 43210" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium text-text-primary">How can we help?</label>
                <textarea className="bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-text-primary transition-colors resize-none flex-1 min-h-[120px]" placeholder="I'm looking to invest in..."></textarea>
              </div>

              <button type="button" className="group relative bg-text-primary text-bg hover:bg-bg hover:text-text-primary rounded-xl text-sm px-8 py-4 mt-4 transition-all overflow-hidden font-medium">
                <span className="absolute inset-[-2px] rounded-xl accent-gradient opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
                <span className="relative z-10">Submit Enquiry</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
