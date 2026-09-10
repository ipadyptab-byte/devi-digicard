import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, MessageCircle, Phone, Globe, MapPin, IndianRupee, X, UserPlus, Clock, Share2, Copy, Check, TrendingUp, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import GoldDust from './components/GoldDust';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Devi Jewellers
ORG:Devi Jewellers
TEL;TYPE=WORK,VOICE:+91 9881236771
TEL;TYPE=CELL,VOICE:+91 9765236771
URL:https://devi-jewellers.com
END:VCARD`;

const vcardDataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;

const LINKS = [
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/devijewellerssatara', delay: 0.4 },
  { name: 'WhatsApp', icon: MessageCircle, href: 'https://wa.me/919881236771', delay: 0.5 },
  { name: 'Call Now', icon: Phone, href: 'tel:+919881236771', delay: 0.6 },
  { name: 'Website', icon: Globe, href: 'https://devi-jewellers.com', delay: 0.7 },
  { name: 'Maps', icon: MapPin, href: 'https://maps.app.goo.gl/uQPtYYZgeECDcMao7', delay: 0.8 },
  { name: 'Pay Now', icon: IndianRupee, href: 'upi://pay?pa=9881236771@upi&pn=Devi%20Jewellers&cu=INR', delay: 0.9 },
  { name: 'Save Contact', icon: UserPlus, href: vcardDataUri, delay: 1.0 },
];

const BRANCHES = [
  {
    id: 'satara',
    name: 'Satara Branch',
    whatsapp: 'https://wa.me/919881236771',
    call: 'tel:+919881236771',
    maps: 'https://maps.app.goo.gl/uQPtYYZgeECDcMao7',
  },
  {
    id: 'koregoan',
    name: 'Koregoan Branch',
    whatsapp: 'https://wa.me/919765236771',
    call: 'tel:+919765236771',
    maps: 'https://www.google.com/maps/dir//Devi+Jewellers+Koregaon,+M5X4%2BXM5,+opposite+rest+house,+Koregaon,+Maharashtra+415501/@17.6848896,73.9934208,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bc235d67322a551:0x3b165afefc2ca2a4!2m2!1d74.1567507!2d17.6998898?entry=ttu&g_ep=EgoyMDI2MDYyMS4wIKXMDSoASAFQAw%3D%3D',
  }
];

export default function App() {
  const [branchModal, setBranchModal] = useState<{isOpen: boolean, type: 'whatsapp' | 'call' | 'maps' | 'upi' | null}>({isOpen: false, type: null});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('pdf-content');
    
    // Wait for the UI to reflect isGeneratingPdf state
    await new Promise(resolve => setTimeout(resolve, 50));
    
    if (element) {
      try {
        const dataUrl = await toJpeg(element, { quality: 0.95, pixelRatio: 2 });
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [element.offsetWidth, element.offsetHeight]
        });
        
        pdf.addImage(dataUrl, 'JPEG', 0, 0, element.offsetWidth, element.offsetHeight);
        
        // Add clickable links
        const links = element.querySelectorAll('a');
        const elementRect = element.getBoundingClientRect();
        
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href !== '#') {
            const rect = link.getBoundingClientRect();
            // In jspdf with 'px' units, the coordinates correspond directly to DOM pixels
            pdf.link(
              rect.left - elementRect.left, 
              rect.top - elementRect.top, 
              rect.width, 
              rect.height, 
              { url: link.href }
            );
          }
        });
        
        pdf.save('DEVI JEWELLERS DIGI CARD.pdf');
      } catch (err) {
        console.error('Error generating PDF:', err);
      }
    }
    setIsGeneratingPdf(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Devi Jewellers',
      text: 'Check out Devi Jewellers digital card!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (e: React.MouseEvent, link: typeof LINKS[0]) => {
    if (link.name === 'Save Contact') {
      // Allow default action (which uses the download attribute on the <a> tag)
      return;
    } else if (link.name === 'WhatsApp') {
      e.preventDefault();
      setBranchModal({ isOpen: true, type: 'whatsapp' });
    } else if (link.name === 'Call Now') {
      e.preventDefault();
      setBranchModal({ isOpen: true, type: 'call' });
    } else if (link.name === 'Maps') {
      e.preventDefault();
      setBranchModal({ isOpen: true, type: 'maps' });
    } else if (link.name === 'Pay Now') {
      e.preventDefault();
      setBranchModal({ isOpen: true, type: 'upi' });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#fcf9f2] font-poppins text-[#1a1515] relative overflow-x-hidden selection:bg-[#7d1818] selection:text-[#ffffff]">
      {/* Fixed Decorative Frames */}
      <div className="fixed inset-0 border-[6px] md:border-[12px] border-[#7d1818] pointer-events-none z-50"></div>
      <div className="fixed inset-[6px] md:inset-[12px] border border-[#b8860b]/30 pointer-events-none z-50"></div>

      {/* Main Scrollable Content Wrapper */}
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 py-10 sm:p-8">
        <motion.div 
          id="pdf-content"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full max-w-[420px] bg-[#ffffff] border border-[#b8860b]/15 shadow-[0_20px_40px_rgba(0,0,0,0.05)] p-5 sm:p-10 relative z-10 flex flex-col items-center my-auto overflow-hidden"
        >
        <GoldDust />
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-4 pt-2">
          <motion.a 
            href="https://devi-jewellers.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            className="h-28 flex items-center justify-center cursor-pointer"
          >
            <img 
              src="/logo.jpeg" 
              alt="Devi Jewellers Logo" 
              className="max-h-full w-auto object-contain drop-shadow-[0_4px_3px_rgba(0,0,0,0.07)]"
            />
          </motion.a>
        </div>

        {/* Links Section */}
        <div className="mt-8 grid grid-cols-2 gap-3 w-full">
          {LINKS.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              download={link.name === 'Save Contact' ? 'Devi_Jewellers.vcf' : undefined}
              onClick={(e) => handleLinkClick(e, link)}
              target={link.href.startsWith('tel:') || link.href.startsWith('upi:') || link.href.startsWith('data:') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: link.delay }}
              whileHover={{ y: -4 }}
              className={`group flex flex-col items-center justify-center p-6 bg-[#ffffff] border border-[#b8860b]/15 hover:border-[#7d1818] transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${index === LINKS.length - 1 && LINKS.length % 2 !== 0 ? 'col-span-2 py-5' : ''}`}
            >
              <link.icon className="w-6 h-6 text-[#b8860b] mb-3 group-hover:text-[#7d1818] transition-colors" strokeWidth={1.5} />
              
              <span className="font-sans text-[10px] text-[#7d1818] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center break-words w-full">
                {link.name}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Opening Hours */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-6 w-full bg-[#ffffff] border border-[#b8860b]/15 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#b8860b]" />
            <h3 className="font-playfair text-[#1a1515] uppercase tracking-widest text-xs">Opening Hours</h3>
          </div>
          
          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between items-center gap-2 text-[10px] font-sans border-b border-[#b8860b]/10 pb-3">
              <span className="text-[#7d1818] uppercase tracking-[0.1em] font-medium">Satara Branch</span>
              <span className="text-[#1a1515]/70 tracking-wider whitespace-nowrap">10:30 AM - 08:30 PM</span>
            </div>
            <div className="flex justify-between items-center gap-2 text-[10px] font-sans border-b border-[#b8860b]/10 pb-3 pt-1">
              <span className="text-[#7d1818] uppercase tracking-[0.1em] font-medium">Koregaon Branch</span>
              <span className="text-[#1a1515]/70 tracking-wider whitespace-nowrap">10:30 AM - 08:30 PM</span>
            </div>
            <div className="flex justify-center items-center text-[9px] font-sans pt-1">
              <span className="text-[#1a1515]/50 uppercase tracking-[0.15em] font-medium bg-[#fcf9f2] px-3 py-1 rounded-full border border-[#b8860b]/20">Saturday Closed</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        {!isGeneratingPdf && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-6 w-full flex flex-col gap-3"
          >
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#7d1818] text-[#ffffff] hover:bg-[#b8860b] transition-colors duration-300 font-sans text-[11px] uppercase tracking-[0.2em]"
            >
              <Share2 className="w-4 h-4" />
              Share Digital Card
            </button>
            
            <button 
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#ffffff] text-[#7d1818] border border-[#7d1818] hover:bg-[#fcf9f2] transition-colors duration-300 font-sans text-[11px] uppercase tracking-[0.2em]"
            >
              <Download className="w-4 h-4" />
              Download as PDF
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="flex justify-center items-center mb-4 text-[#b8860b]">
            <span className="text-xl">◈</span>
          </div>
          <p className="text-[9px] text-[#1a1515]/50 uppercase tracking-[0.3em] font-sans">
            Luxury Redefined
          </p>
          {isGeneratingPdf && (
            <a href={window.location.href} className="mt-6 block text-[9px] text-[#7d1818] uppercase tracking-[0.2em] font-sans underline decoration-[#b8860b]/50 underline-offset-4">
              Click here to view Live Digital Card
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Branch Modal */}
      <AnimatePresence>
        {branchModal.isOpen && branchModal.type && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1515]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#fcf9f2] border-[4px] border-[#7d1818] w-full max-w-sm p-8 relative flex flex-col items-center overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-1 border border-[#b8860b]/30 pointer-events-none"></div>
              
              <button 
                onClick={() => setBranchModal({ isOpen: false, type: null })}
                className="absolute top-4 right-4 text-[#7d1818] hover:text-[#b8860b] transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-14 h-14 rounded-full border border-[#b8860b] flex items-center justify-center bg-gradient-to-br from-[#7d1818] to-[#4a0d0d] mb-5 shadow-[0_10px_15px_rgba(0,0,0,0.1)] relative z-10">
                {branchModal.type === 'whatsapp' && <MessageCircle className="w-7 h-7 text-[#b8860b]" />}
                {branchModal.type === 'call' && <Phone className="w-7 h-7 text-[#b8860b]" />}
                {branchModal.type === 'maps' && <MapPin className="w-7 h-7 text-[#b8860b]" />}
                {branchModal.type === 'upi' && <IndianRupee className="w-7 h-7 text-[#b8860b]" />}
              </div>
              
              <h2 className="font-playfair text-xl text-[#1a1515] uppercase tracking-widest mb-2 text-center relative z-10">
                {branchModal.type === 'upi' ? 'Scan to Pay' : 'Select Branch'}
              </h2>
              <p className="text-[10px] text-[#1a1515]/60 uppercase tracking-[0.1em] font-sans text-center mb-6 relative z-10">
                {branchModal.type === 'upi' ? 'Use any UPI app to scan and pay' : 'Choose a branch to proceed'}
              </p>
              
              {branchModal.type === 'upi' ? (
                <div className="flex flex-col items-center relative z-10 w-full">
                  <div className="bg-[#ffffff] p-4 border border-[#b8860b]/30 mb-4 flex justify-center">
                    <QRCodeSVG value="upi://pay?pa=9881236771@upi&pn=Devi%20Jewellers&cu=INR" size={150} fgColor="#1a1515" />
                  </div>
                  
                  <div className="w-full flex items-center justify-between bg-[#fcf9f5] border border-[#b8860b]/30 p-3 mb-6 relative group cursor-pointer hover:bg-[#f5f0e6] transition-colors"
                       onClick={async () => {
                         try {
                           await navigator.clipboard.writeText('9881236771@upi');
                           setCopied(true);
                           setTimeout(() => setCopied(false), 2000);
                         } catch (err) {
                           console.error('Failed to copy text: ', err);
                         }
                       }}>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#1a1515]/60 uppercase tracking-widest font-sans mb-0.5">UPI ID (Click to copy)</span>
                      <span className="font-sans text-[13px] font-medium text-[#1a1515]">9881236771@upi</span>
                    </div>
                    <div className="text-[#7d1818] group-hover:text-[#b8860b] transition-colors">
                      {copied ? <Check className="w-4 h-4 text-[#16a34a]" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>

                  <a
                    href="upi://pay?pa=9881236771@upi&pn=Devi%20Jewellers&cu=INR"
                    className="w-full bg-[#7d1818] text-[#ffffff] py-4 font-sans text-[12px] uppercase tracking-[0.2em] border border-[#b8860b]/30 hover:bg-[#b8860b] transition-all duration-300 text-center flex items-center justify-center gap-2 group"
                  >
                    Open UPI App
                  </a>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3 relative z-10">
                  {BRANCHES.map((branch, index) => (
                    <motion.a
                    key={branch.id}
                    href={branch[branchModal.type as 'whatsapp' | 'call' | 'maps']}
                    target={branchModal.type === 'maps' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    onClick={() => setBranchModal({ isOpen: false, type: null })}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.15 }}
                    className="w-full bg-[#ffffff] text-[#7d1818] hover:bg-[#7d1818] hover:text-[#ffffff] py-4 font-sans text-[12px] uppercase tracking-[0.2em] border border-[#b8860b]/30 hover:border-[#7d1818] transition-all duration-300 text-center flex items-center justify-center group"
                  >
                    {branch.name}
                  </motion.a>
                ))}
              </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1515]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#fcf9f2] border-[4px] border-[#7d1818] w-full max-w-sm p-8 relative flex flex-col items-center overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-1 border border-[#b8860b]/30 pointer-events-none"></div>
              
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 text-[#7d1818] hover:text-[#b8860b] transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-14 h-14 rounded-full border border-[#b8860b] flex items-center justify-center bg-gradient-to-br from-[#7d1818] to-[#4a0d0d] mb-5 shadow-[0_10px_15px_rgba(0,0,0,0.1)] relative z-10">
                <Share2 className="w-7 h-7 text-[#b8860b]" />
              </div>
              
              <h2 className="font-playfair text-xl text-[#1a1515] uppercase tracking-widest mb-2 text-center relative z-10">Share Card</h2>
              <p className="text-[10px] text-[#1a1515]/60 uppercase tracking-[0.1em] font-sans text-center mb-6 relative z-10">
                Scan or copy the link below
              </p>
              
              <div className="bg-[#ffffff] p-4 border border-[#b8860b]/30 relative z-10 mb-6 flex justify-center">
                <QRCodeSVG value={window.location.href} size={150} fgColor="#1a1515" />
              </div>

              <div className="w-full flex flex-col gap-3 relative z-10">
                <button
                  onClick={handleShare}
                  className="w-full bg-[#7d1818] text-[#ffffff] py-4 font-sans text-[12px] uppercase tracking-[0.2em] hover:bg-[#b8860b] transition-all duration-300 text-center flex items-center justify-center gap-2 group"
                >
                  <Share2 className="w-4 h-4" />
                  Share Link
                </button>
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-[#ffffff] text-[#7d1818] border border-[#b8860b]/30 py-4 font-sans text-[12px] uppercase tracking-[0.2em] hover:border-[#7d1818] transition-all duration-300 text-center flex items-center justify-center gap-2 group"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
