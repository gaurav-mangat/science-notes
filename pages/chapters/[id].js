import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { chapters } from '../../data/chapters';

export default function ChapterPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isPaid, setIsPaid] = useState(false);
  const chapter = chapters[id] || { title: "Chapter not found" };

  // Check payment status on load
  useEffect(() => {
    const paidStatus = localStorage.getItem(`paid-${id}`) === 'true';
    setIsPaid(paidStatus);
  }, [id]);

  const handlePayment = () => {
    const confirm = window.confirm("Pay ₹10 to unlock this chapter? (Demo)");
    if (confirm) {
      localStorage.setItem(`paid-${id}`, 'true');
      setIsPaid(true);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{chapter.title}</h1>
      
      <div className="mt-8 space-y-6">
        {/* Notes Section */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Notes</h2>
          {isPaid ? (
            <iframe 
              src={chapter.notesUrl} 
              className="w-full h-[500px] border"
            />
          ) : (
            <div className="text-center py-10">
              <button
                onClick={handlePayment}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Unlock Notes (₹10 Demo)
              </button>
            </div>
          )}
        </div>

        {/* Solutions Section (same structure) */}
      </div>
    </div>
  );
}