import { useState, useEffect } from "react";
import { X, MapPin, MessageCircle, Navigation } from "lucide-react";

export function LocationQRPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const brandConfig = (window as any).__BRAND_CONFIG__ || {};
  const locationQrUrl = brandConfig.locationQrUrl || "";
  const contactAddress = brandConfig.contactAddress || "";
  const contactPhone = brandConfig.contactPhone || "";
  const mapsUrl = brandConfig.locationMapsUrl || "https://maps.google.com";

  useEffect(() => {
    const showPopup = () => {
      setIsOpen(true);
    };

    // Show the location card shortly after the page loads so it is not mistaken
    // for a broken feature. It can be dismissed and will reappear every 10 minutes.
    const initialTimer = setTimeout(showPopup, 10000);
    const intervalTimer = setInterval(showPopup, 10 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  if (!isOpen || (!locationQrUrl && !contactAddress && !contactPhone)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl max-w-sm w-full border-4 border-golden animate-in fade-in zoom-in duration-300">
        <div className="bg-golden p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-black font-bold uppercase">
            <MapPin className="w-5 h-5" />
            <span>Visit Our Institute</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-lg font-bold mb-4 text-foreground">
            Scan to Know the Location
          </p>
          
          {locationQrUrl ? (
            <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-inner">
              <img
                src={locationQrUrl}
                alt="Scan for institute location"
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>
          ) : (
            <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-900">
              <MapPin className="mx-auto mb-2 h-10 w-10" />
              <p className="text-sm">Use the button below to open the institute location.</p>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground font-mono mb-6">
            {contactAddress}
          </p>
          
          <div className="flex flex-col gap-3">
            <a 
              href={contactPhone ? `https://wa.me/${contactPhone.replace(/\D/g, "")}` : "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => { if (!contactPhone) e.preventDefault(); }}
              className="w-full bg-green-500 text-white font-bold py-3 px-6 uppercase text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Chat / Call Enquiry
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 uppercase text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" /> Open in Google Maps
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-golden text-black font-bold py-2 px-6 uppercase text-sm hover:bg-golden/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
