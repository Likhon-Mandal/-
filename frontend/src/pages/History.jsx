import React from 'react';
import { Scroll } from 'lucide-react';

const History = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 animate-slide-up">
        <h1 className="text-4xl font-serif font-bold text-primary">Our Heritage</h1>
        <p className="text-xl text-stone-500">The Legacy of Bhagoban Chandra Barai</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-orange-100 prose prose-stone max-w-none animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-center mb-6">
            <Scroll className="h-16 w-16 text-secondary animate-pulse" />
        </div>
        
        <p className="lead text-lg">
          Our community traces its roots back to the visionary Bhagoban Chandra Barai. 
          Spread across the districts of Madaripur, Gopalgong, Barishal, and Pirojpur, 
          our family has grown into a vibrant community of over 10,000 members.
        </p>

        <h3 className="font-serif text-2xl text-primary mt-8 mb-4">The 2013 Ancestral Book</h3>
        <p>
          In 2013, a monumental effort was undertaken to document our history. 
          A 305-page book was published, meticulously recording the lineage and personal details 
          of our community members. This book served as the cornerstone of our shared identity, 
          preserving information that might otherwise have been lost to time.
        </p>

        <h3 className="font-serif text-2xl text-primary mt-8 mb-4">The Annual Gathering</h3>
        <p>
          Every year, on the <strong>10th of Falgun</strong> (Bengali Calendar), our community comes together 
          to celebrate our bond. The 93rd gathering was recently hosted in our village, marking nearly 
          a century of unity and tradition. These gatherings are not just events; they are a testament 
          to our enduring connection.
        </p>

        <h3 className="font-serif text-2xl text-primary mt-8 mb-4">Moving to the Digital Age</h3>
        <p>
          Today, we are taking a significant step forward by digitizing our records. 
          Projenitor, our new web-based platform, aims to make this rich history accessible 
          to every member, wherever they may be in the world. By bridging the past with the future, 
          we ensure that the legacy of Bhagoban Chandra Barai continues to thrive for generations to come.
        </p>
      </div>
    </div>
  );
};

export default History;
