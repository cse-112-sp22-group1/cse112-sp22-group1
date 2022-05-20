# Agenda

- [ ]  Discuss Professor Powell’s suggested changes

# Potential blockers?

- Covid19

# Action items

- More detailed commit messages on commits, front-end can add link to a screenshot of UI changes
- Look into commit message style ([https://github.com/mpv-player/mpv/blob/master/DOCS/contribute.md#write-good-commit-messages](https://github.com/mpv-player/mpv/blob/master/DOCS/contribute.md#write-good-commit-messages))
- Make document on notion for commit style version? md file in the repository about it
- Update the README from

# Meeting Notes

Should talk to professor more.

- Changes to hide sidebar on right or other sidebars by default, and have buttons to open it up to satisfy
- For today’s log, keep trackers on a card in the log itself instead of having trackers in their own separate page to avoid taking too many clicks
    - Content focused, keep the trackers? Or make cards on the right user customizable (whether they want it there or not) while keeping the sidebar the same for all users
- For Monthly logs, add a calendar near bottom that shows all daily logs
    - Display card components for logs and put them on a grid for the calendar
        - Can show first 2 lines or so of the daily log as preview on the calendar grid
        - Look at / modify existing calendar code like [https://github.com/nhn/tui.calendar](https://github.com/nhn/tui.calendar)
    - Previous list of daily logs
- Themes looks good but low priority

- ADR for backend changes
- PR for card components for monthly logs
- Left sidebar redesign
- Header bar
- Log Component
    - Can discuss the task over the weekend / early week
    - Define requirements?
    - Index page, can have a Notes section with text, Collections / Monthly logs can be cards, last section could be calendar with the daily logs
- New button by search bar vs Add button next to Collections cards
- When creating a future log you have sections for the Title, Notes, Monthly Logs,

### Testing 

- Testing Guidelines and ADR
    - James working on backend testing
    - Utilizing Jest & Puppeteer to maintain status quo
- Will put Testing Guidelines in Notion
    - add links to resources on how to write good unit tests with Jest on the guidelines

### Routing changes with new sidebar rework

- ex. displaying id of the log the user is currently on in the url

### Backburner

- still there

More minimalized version of current editor on the tracker card