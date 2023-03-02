# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

## Assumptions
Assuming the following: 
1. A `Facility` can post multiple `Shifts` on the platform
2. An `Agent` can work on multiple NON overlapping `Shifts`
3. A `Shift` is owned by a one and only one `Facility` (the one that posted it) and can be assigned to one and only one `Agent` (like in a booking system, it is not allowed for two agents to take the same shift)  

From my understanding the basic idea behind the required functionality is to create some custom mapping between:
- The `agentId` stored inside the `Agents` table 
- A `customAgentId` provided by the specific facility

This custom mapping must probably be: 
- Different for each facility 
- Persisted somewhere 

In order to keep things simple we could at first assume that the mapping, once defined, cannot be changed.
Also we could have two ways in the Frontend to generate those custom ids: 
1. Bulk generation (e.g. add a prefix to all the ids or a suffix)
2. Single generation (e.g. before generating the PDF there would be an additional step that shows the temporary table to the user allowing her to change the ids)

Depending on the business needs, probably from an effort point of view, solution 1 would be easier. 
For the scope of this challenge I can assume that editing a single ID is more important than editing them in bulk for the sake of exploring the more complex idea. 

## Tickets
I would split the ticket in the following way: 

### 1 - As a facility operator I should be able to preview the generated report

**Description**: As a facility operator I should be able to preview the generated report. Since a report can contain a lot of entries, the preview must support pagination. 

The preview should at least support the following columns: 
- AgentId
- Agent Full Name
- Total Time

As a title for the preview we should mention the referred quarter

The API must be authenticated and could be something like: 

`GET /reports/shifts?from=xxx&to=xxx&limit=xxx&skip=xxx`

The facility id should be taken from the JWT in order not to allow other facilities to generate data they are not allowed to see.

**Acceptance criteria**: 
- There exist a page in the FE that allows for report preview (see Figma design)
- There exist an API to get a report preview. The API is authenticated and paginated

### 2 - As a facility operator I should be able to change the id of an operator 

**Description**: As a facility operator I should be able to change the id of an operator from the report preview page. 
Also we need an API like: 

`PATCH /agents/:agentId/custom-fields`

That allows in the body to pass a JSON like 
```json
{
    "customId": "MycustomId"
}
```

This API will infer the facility Id from the JWT token and will persist the relation in a new table: `AgentsFacilitiesCustomFields`. 
This table allows for the future to store something more than a mere `customId` and for now should at least have the following: 
- FacilityId (FK on Facilities) 
- AgentId (FK on Agents) 
- CustomAgentId (UNIQUE - NOT NULL)

**Acceptance criteria**: 
- There exist a way in the preview to edit a single agent id
- There exist an API to edit a custom id for a specific operator for a given facility
- The custom id is persisted in a new table `AgentsFacilitiesCustomFields`

### 3 - As a facility operator I should be able to generate a report

**Description**: As a facility operator I should be able to generate a report. There must be a button that allows for generating the report starting from the preview.

The API should look like: 

`POST /reports/shifts/generate`

And should allow in the body for:
```json
{
    "from": "xxx",
    "to": "xxx",
}
```
The route should be authenticated and the facility Id should be taken from the JWT

**Acceptance criteria**: 
- There exist an API to generate a report for a given facility
- There exist a button in FE to generate the report 

## Improvements
From an Agile perspective we can think of some improvements after the first delivery of the functionality: 

### 1 - The report should be cached
Since the report generation could be time consuming we need to think of a way of pre-generate it or cache it. 

### 2 - As facility operator I should be able to change all the ids in bulk adding a prefix or a suffix
It could be useful for a facility operator to reuse same prefix for all Agents 


## Final notes
Tickets could be splitted more in backend and frontend in case the team does not have full stack developers or in case the complexity in SP assigned by the team is greater than 8. 
To compute the effort for each ticket I would trust the team and do a planning poker together.
