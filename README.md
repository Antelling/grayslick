# grayslick

Open source test engine. 

Has several differences from a typical survey platform or LMS:

1. Tests are generated from a custom markdown dialect.

2. Tests are automatically graded, and a variety of statistics for each question and response are generated. 

3. Tests record if students leave the tab, making grayslick tests much more secure then typical online tests. 

4. Open ended questions are anonymized before teachers grade them, eliminating subconcious bias. 


This is very far from complete and is super buggy, but the basic features work. 

To run this, create a file called SECRET and place your django secret key within that. Then create the empty file DEV, to put 
django in developer mode. 

#TODO:

* Authentication
  * make link to /auth/logout
  * make log in page styled like rest of app
  * make sign up page check for username availability
  * make legal page and make them agree
  - maybe get email and make reset password page
- Static
  - legal page
  - contact page?
  - make index page copy not suck
- editor
  - add instructions
  - make button to get link to tests
    - url shortener
  - fix preview
- Dash board
  - confirm delete
- results page
  - make stats for rest of question types
    - mc
    - matching
      - difficult to do cleanly
    - open ended
  - add way to delete responses
  - show time away and fix bugs related to time away not existing
- test taking
  - add results review page
  - don't allow submit with empty questions
- Production
  - figure out how backing up databases works
  - add ads and analytics
