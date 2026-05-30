*Question 1*  

 
From: marissa@startup.com  
Subject:  Bad design  

Hello,  
  
Sorry to give you the kind of feedback that I know you do not want to hear, but I really hate the new dashboard design. Clearing and deleting indexes are now several clicks away. I am needing to use these features while iterating, so this is inconvenient.  
   
Thanks,  
Marissa  

*Answer 1* 


Hi Marissa,

Thanks for reaching out and sharing your honest feedback with us. I completely understand how frustrating it is when a UI update slows down your momentum, especially when you're actively iterating and need to clear or delete indexes frequently.

I’m passing your feedback directly over to our Product and Design teams so they can see exactly how this extra friction impacts power users during development.

In the meantime, the absolute fastest way to bypass those dashboard clicks entirely while you're building is to take a programmatic approach. You can clear or delete an index in a single shot using the Algolia CLI:

To clear all records from an index instantly:
"algolia index clear your_index_name"

To delete an index entirely:
"algolia index delete your_index_name"

If you prefer, you can also script this directly into your existing development workflows using our API clients (via the clearObjects() or delete() methods). You can check out the full syntax and parameters for those methods here:
https://www.algolia.com/doc/libraries/sdk/methods/search/clear-objects
https://www.algolia.com/doc/libraries/sdk/methods/search/delete-index
https://www.algolia.com/doc/libraries/sdk/v1/methods/delete-objects


Let me know if you want to get on call so we can set up a quick automation snippet for this together. I’d be happy to walk you through it!

Best,

Nickolas Stricker
Customer Success Engineer @ Algolia
nickolas.stricker@algolia.com
  
--

*Question 2*:   
  
From: carrie@coffee.com  
Subject: URGENT ISSUE WITH PRODUCTION!!!!  
  
Since today 9:15am we have been seeing a lot of errors on our website. Multiple users have reported that they were unable to publish their feedbacks and that an alert box with "Record is too big, please contact enterprise@algolia.com".  
  
Our website is an imdb like website where users can post reviews of coffee shops online. Along with that we enrich every record with a lot of metadata that is not for search. I am already a paying customer of your service, what else do you need to make your search work?  
  
Please advise on how to fix this. Thanks.   

*Answer 2*:   


Hi Carrie,

I completely get the urgency here, having production throw errors for your users is incredibly stressful, so let’s get this sorted out right away.

The "Record is too big" error pops up because Algolia has strict record size limits (typically between 10KB and 100KB per object, depending on your plan tier) to keep search speeds lightning-fast. When your users started posting longer reviews or the non-search metadata expanded this morning, those specific records pushed past the maximum payload limit, causing our API to reject them.

Since a large chunk of the metadata you're tracking isn’t actually meant for search, the standard best practice here is to decouple your heavy metadata from your search index.

Here is how we can fix this permanently:

1. Source of Truth: Keep your primary database as the source of truth for the heavy, non-searchable metadata fields and long text reviews.

2. Streamline Algolia: Only sync search-critical fields to Algolia—like the coffee shop name, general location tags, and a short review snippet.

3. Reference via ID: Keep a unique identifier (like a shop_id or review_id) on your Algolia records. When a user searches and selects a result, use that ID to instantly fetch the heavy metadata blocks from your database on the frontend.

This keeps your index lightweight, kills the size errors completely, and keeps your search performance running smoothly. For some deeper context on how to structure this, take a look at our support breakdown here: https://support.algolia.com/hc/en-us/articles/4406981897617-Is-there-a-size-limit-for-my-index-records

Let me know if you have a few minutes to jump on a quick call today, we can review your payload structure together and strip out those non-search attributes right away!

Best,

Nickolas Stricker
Customer Success Engineer @ Algolia
nickolas.stricker@algolia.com
--

*Question 3*:   


From: marc@hotmail.com  
Subject: Error on website  
  
Hi, my website is not working and here's the error:  
  
![error message](./error.png)  
  
Can you fix it please?  

*Answer 3*:  


Hi Marc,

Thanks for reaching out and dropping in that screenshot of the error message. Let's dig into what's going on here and get your site back on track.

Looking at the stack trace you attached, the browser is running into an Uncaught ReferenceError: searchkit is not defined. This means the code on your page is trying to execute functions from a library wrapper called "Searchkit," but your application isn't loading or importing it correctly before running the script.

Because Searchkit is an open-source, third-party library wrapper and not an official Algolia product, I can't look at or debug that specific code on our end. However, we actually have a fully supported, highly optimized tool built exactly for what you are trying to do.

To get your search running seamlessly without third-party wrapper dependencies, I highly recommend checking out InstantSearch.js (our official frontend UI widget library). It's super easy to plug into vanilla JavaScript projects, and it includes native hooks for performance optimization and analytics tracking out of the box. You can see how our frontend ecosystem is designed by reviewing our Getting Started with InstantSearch guide. 
https://www.algolia.com/doc/guides/sending-events/getting-started

You can get our official packages added to your setup by running:

"npm install algoliasearch instantsearch.js"

I have a straightforward, step-by-step transition guide that shows you how to wire up your UI using our native widgets so this error disappears entirely. For an exact look at how our UI rendering works under the hood, you can check out the InstantSearch Hits Widget API documentation.
https://www.algolia.com/doc/api-reference/widgets/hits/js

Let me know if you would like to hop on a quick call with me to help you make the switch!

Best,

Nickolas Stricker
Customer Success Engineer @ Algolia
nickolas.stricker@algolia.com