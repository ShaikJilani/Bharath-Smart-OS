const fs = require('fs');
const file = 'src/components/CommandCenterDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '{/* Landscape vector details */}';
const endMarker = '</svg>';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    
    const replacement = `{/* Landscape vector details */}
              <img 
                src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Screenshot%202026-07-19%20121619.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9TY3JlZW5zaG90IDIwMjYtMDctMTkgMTIxNjE5LnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ0NDM4MDcsImV4cCI6MjczMDUyMzgwN30.6F6JHcFSavlqCbruPpXPhGk_1EFpYCphSx8x0nHJL-g" 
                alt="Viksit Bharat Map" 
                className="absolute right-0 top-0 h-full w-full object-cover md:w-[55%] md:object-cover mix-blend-luminosity opacity-90"
                style={{ maskImage: 'linear-gradient(to right, transparent, black 15%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)' }}
              />`;

    fs.writeFileSync(file, before + replacement + after);
    console.log('Successfully replaced SVG with IMG');
} else {
    console.log('Markers not found');
}
