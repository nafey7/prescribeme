# Flight Booking Request-Response Cycle: Complete Trace

> **Document Purpose**: Trace the complete request-response cycle for a flight booking request in Voya AI Chat, focusing on the LangGraph architecture and state management.

## Table of Contents

1. [Overview](#overview)
2. [Example Request](#example-request)
3. [Request-Response Flow Diagram](#request-response-flow-diagram)
4. [Component-by-Component Breakdown](#component-by-component-breakdown)
5. [State Management in LangGraph](#state-management-in-langgraph)
6. [Key Files Reference](#key-files-reference)

---

## Overview

When a user sends a flight booking request like:

> "Book a flight for me from LHR to JFK on 26 April 2026. The flight should be one-way and it is only for 1 passenger"

The request passes through multiple layers:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           VOYA FLIGHT BOOKING ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Frontend (React)                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  ChatBot Component  →  POST /api/chat/message  →  Response + UI Type     │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                     │                                            │
│                                     ▼                                            │
│  Backend (FastAPI)                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           Chat API Router                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │   │
│  │  │                         ChatService                                  │ │   │
│  │  │  ┌───────────────────────────────────────────────────────────────┐  │ │   │
│  │  │  │               Intent Recognizer (4-Layer Cascade)              │  │ │   │
│  │  │  │   1. Sticky Session → 2. Explicit Patterns → 3. Heuristics    │  │ │   │
│  │  │  │                     → 4. LLM Classifier                        │  │ │   │
│  │  │  └───────────────────────────────────────────────────────────────┘  │ │   │
│  │  │                              │                                       │ │   │
│  │  │                              ▼                                       │ │   │
│  │  │  ┌───────────────────────────────────────────────────────────────┐  │ │   │
│  │  │  │              LangGraph Flight Agent (ReAct)                    │  │ │   │
│  │  │  │   ┌─────────────────────────────────────────────────────────┐ │  │ │   │
│  │  │  │   │  Gemini 2.0 Flash LLM  +  Tools (resolve_airport,       │ │  │ │   │
│  │  │  │   │                          parse_dates, search_flights)   │ │  │ │   │
│  │  │  │   └─────────────────────────────────────────────────────────┘ │  │ │   │
│  │  │  └───────────────────────────────────────────────────────────────┘  │ │   │
│  │  └─────────────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                     │                                            │
│                                     ▼                                            │
│  External Services                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  MongoDB (State)  │  FlightLogic API (Flights)  │  Langfuse (Traces)     │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Example Request

**User Message:**
```
"Book a flight for me from LHR to JFK on 26 April 2026. The flight should be one-way and it is only for 1 passenger"
```

**Extracted Information:**
| Field | Value | Source |
|-------|-------|--------|
| Origin | LHR | `resolve_airport` tool |
| Destination | JFK | `resolve_airport` tool |
| Departure Date | 2026-04-26 | `parse_dates` tool |
| Return Date | None (one-way) | User explicit |
| Adults | 1 | User explicit |
| Children | 0 | Default |
| Infants | 0 | Default |

---

## Request-Response Flow Diagram

### Phase 1: HTTP Request Entry

```
User Message: "Book a flight for me from LHR to JFK on 26 April 2026..."
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: FastAPI Chat Endpoint                                                  │
│  File: backend_python/app/api/chat.py                                           │
│                                                                                  │
│  @router.post("/message", response_model=ChatResponse)                          │
│  async def chat_message(request: ChatRequest, user: UserPublic):                │
│      # 1. Get or create chat_id for conversation continuity                     │
│      chat_id = request.chat_id or await get_or_create_chat_conversation(...)    │
│                                                                                  │
│      # 2. Acquire distributed lock to prevent race conditions                   │
│      async with chat_lock.acquire(chat_id):                                     │
│          # 3. Delegate to ChatService                                           │
│          response = await chat_service.process_message(message, user, chat_id)  │
│                                                                                  │
│      return response                                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 2: ChatService Message Processing

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: ChatService.process_message()                                          │
│  File: backend_python/app/domains/chat/service.py                               │
│                                                                                  │
│  PRIORITY 1: Check active itinerary session (n8n) → Not applicable              │
│  PRIORITY 1.5: LangGraph Router (if feature flag) → Skip if flag disabled       │
│  PRIORITY 2: Check LangGraph booking sessions → Check MongoDB for active state  │
│  PRIORITY 3: Run Intent Recognizer                                              │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Intent Recognizer (4-Layer Cascade Architecture)                        │   │
│  │  File: backend_python/app/ai/intent_recognizer.py                        │   │
│  │                                                                           │   │
│  │  Layer 1: Sticky Session (1ms) → Check previous high-confidence intent   │   │
│  │           Result: No sticky session (new conversation)                    │   │
│  │                                                                           │   │
│  │  Layer 2: Explicit Patterns (2ms) → Regex matching                       │   │
│  │           Pattern: "^book\s+(?:a\s+)?flights?\s+.*"                       │   │
│  │           Result: BOOK_FLIGHT (0.95 confidence)  ✓ MATCHED               │   │
│  │                                                                           │   │
│  │  FINAL RESULT: Intent.BOOK_FLIGHT, confidence=0.95                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  Routing Decision:                                                              │
│  if settings.VOYA_FEATURE_FLAG_USE_LANGGRAPH_FLIGHTS:                           │
│      response = await self._handle_flight_via_langgraph(message, user, chat_id) │
│  else:                                                                          │
│      response = await flight_handler.handle_booking_conversation(...)           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 3: LangGraph Flight Agent Execution

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 3: invoke_flight_graph()                                                  │
│  File: backend_python/app/ai/graph/flight_graph.py                              │
│                                                                                  │
│  # 1. Get compiled graph singleton with MongoDB checkpointer                    │
│  graph = get_flight_graph()                                                     │
│                                                                                  │
│  # 2. Build input state                                                         │
│  input_state = {                                                                │
│      "messages": [HumanMessage(content=message)],                               │
│      "user_id": user_id,                                                        │
│      "chat_id": chat_id,                                                        │
│      "flight": flight_params_dict,  # Pre-extracted params if any              │
│  }                                                                              │
│                                                                                  │
│  # 3. Configure thread_id for state persistence                                 │
│  config = {"configurable": {"thread_id": chat_id}}                              │
│                                                                                  │
│  # 4. Invoke graph with Langfuse tracing                                        │
│  with traced_observation(message_id, session_id, user_id, name="flight-agent"): │
│      result = await graph.ainvoke(input_state, config)                          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 4: ReAct Agent Tool Execution Loop

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 4: ReAct Agent Reasoning Loop                                             │
│  Created by: langgraph.prebuilt.create_react_agent()                            │
│                                                                                  │
│  ═══════════════════════════════════════════════════════════════════════════   │
│  ITERATION 1: LLM Analyzes Message                                              │
│  ═══════════════════════════════════════════════════════════════════════════   │
│                                                                                  │
│  LLM INPUT (System Prompt + User Message):                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  "You are MyVoya, a helpful flight booking assistant.                    │   │
│  │   Today's date: 2026-01-29                                               │   │
│  │   ...                                                                    │   │
│  │   User: Book a flight for me from LHR to JFK on 26 April 2026.          │   │
│  │          The flight should be one-way and it is only for 1 passenger"   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  LLM REASONING:                                                                  │
│  "User wants to book a flight. I have:                                          │
│   - Origin: LHR (already an IATA code, but should verify)                       │
│   - Destination: JFK (already an IATA code, but should verify)                  │
│   - Date: 26 April 2026 (need to parse)                                         │
│   - One-way, 1 adult                                                            │
│   I should: 1) Resolve airports, 2) Parse date, 3) Search flights"             │
│                                                                                  │
│  LLM OUTPUT: Tool calls                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Tool Call 1: resolve_airport(query="LHR")                               │   │
│  │  Tool Call 2: resolve_airport(query="JFK")                               │   │
│  │  Tool Call 3: parse_dates(text="26 April 2026")                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 5: Tool Execution (Parallel)                                              │
│  Files: backend_python/app/ai/graph/tools/*.py                                  │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │  Tool: resolve_airport(query="LHR")                                     │    │
│  │  File: backend_python/app/ai/graph/tools/airport.py                     │    │
│  │                                                                          │    │
│  │  1. Detect query type: _is_city_name("LHR") → False (3-letter code)     │    │
│  │  2. Call AirportResolver via service.resolve("LHR")                      │    │
│  │  3. Look up in 29,000+ airport database (mwgg/Airports)                  │    │
│  │                                                                          │    │
│  │  RESULT:                                                                 │    │
│  │  {                                                                       │    │
│  │    "status": "resolved",                                                 │    │
│  │    "iata": "LHR",                                                        │    │
│  │    "name": "London Heathrow Airport",                                    │    │
│  │    "city": "London",                                                     │    │
│  │    "country": "United Kingdom",                                          │    │
│  │    "query_is_city_name": false                                           │    │
│  │  }                                                                       │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │  Tool: resolve_airport(query="JFK")                                     │    │
│  │                                                                          │    │
│  │  RESULT:                                                                 │    │
│  │  {                                                                       │    │
│  │    "status": "resolved",                                                 │    │
│  │    "iata": "JFK",                                                        │    │
│  │    "name": "John F. Kennedy International Airport",                      │    │
│  │    "city": "New York",                                                   │    │
│  │    "country": "United States",                                           │    │
│  │    "query_is_city_name": false                                           │    │
│  │  }                                                                       │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │  Tool: parse_dates(text="26 April 2026")                                │    │
│  │  File: backend_python/app/ai/graph/tools/dates.py                       │    │
│  │                                                                          │    │
│  │  1. Try DateParser.parse_absolute_date("26 April 2026")                  │    │
│  │  2. Parse month name + day + year                                        │    │
│  │                                                                          │    │
│  │  RESULT:                                                                 │    │
│  │  {                                                                       │    │
│  │    "departure_date": "2026-04-26",                                       │    │
│  │    "return_date": null,                                                  │    │
│  │    "is_range": false,                                                    │    │
│  │    "parsed_from": "26 April 2026"                                        │    │
│  │  }                                                                       │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ITERATION 2: LLM Reviews Tool Results and Continues                            │
│                                                                                  │
│  LLM sees ToolMessage results and decides next action:                          │
│  "All airports resolved, date parsed. I have all required fields:               │
│   - origin: LHR                                                                 │
│   - destination: JFK                                                            │
│   - departure_date: 2026-04-26                                                  │
│   - return_date: null (one-way)                                                 │
│   - adults: 1, children: 0, infants: 0                                          │
│   Now I should search for flights."                                             │
│                                                                                  │
│  LLM OUTPUT: Tool call                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Tool Call: search_flights(                                              │   │
│  │    origin="LHR",                                                         │   │
│  │    destination="JFK",                                                    │   │
│  │    departure_date="2026-04-26",                                          │   │
│  │    return_date=null,                                                     │   │
│  │    adults=1,                                                             │   │
│  │    children=0,                                                           │   │
│  │    infants=0,                                                            │   │
│  │    origin_is_city=false,                                                 │   │
│  │    destination_is_city=false                                             │   │
│  │  )                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 6: Flight Search Tool Execution                                           │
│  File: backend_python/app/ai/graph/tools/flights.py                             │
│                                                                                  │
│  @tool("search_flights", args_schema=FlightSearchInput)                         │
│  async def search_flights(...) -> dict[str, Any]:                               │
│                                                                                  │
│  1. VALIDATE INPUT                                                              │
│     - Check IATA codes are 3 letters ✓                                          │
│     - Check origin != destination ✓                                             │
│     - Parse departure_date to date object ✓                                     │
│                                                                                  │
│  2. BUILD SEARCH REQUEST                                                        │
│     FlightSearchRequest(                                                        │
│       journey_type=JourneyType.ONE_WAY,                                         │
│       origin_destination_info=[                                                  │
│         OriginDestinationSegment(                                               │
│           departure_date=date(2026, 4, 26),                                     │
│           origin_airport=AirportInfo(iata_code="LHR"),                          │
│           destination_airport=AirportInfo(iata_code="JFK"),                     │
│         )                                                                       │
│       ],                                                                        │
│       cabin_class=CabinClass.ECONOMY,                                           │
│       adults=1,                                                                 │
│       city_wise_search_origin=false,  # LHR is airport code, not city          │
│       city_wise_search_destination=false,                                       │
│     )                                                                           │
│                                                                                  │
│  3. CALL FLIGHTLOGIC API                                                        │
│     from integrations.flightlogic.client import FlightLogicClient               │
│     client = FlightLogicClient()                                                │
│     response = await client.search_flights(request)                             │
│                                                                                  │
│  4. PROCESS RESPONSE (for each FareItinerary)                                   │
│     - Extract flight info: _extract_flight_info(itinerary)                      │
│     - Apply platform fee: apply_platform_fee(original_price)                    │
│     - Enrich with airport names from database                                   │
│                                                                                  │
│  5. CURATE INTO CATEGORIES                                                      │
│     cheapest = sorted(flights, key=lambda f: f["price"])[:3]                    │
│     fastest = sorted(flights, key=lambda f: f["duration_minutes"])[:3]          │
│     best_value = sorted(flights, key=value_score)[:3]                           │
│                                                                                  │
│  6. RETURN RESULT                                                               │
│  {                                                                               │
│    "status": "success",                                                          │
│    "session_id": "FL_ABC123...",  # FlightLogic session for revalidation        │
│    "summary": {                                                                  │
│      "total_found": 45,                                                          │
│      "direct_flights": 12,                                                       │
│      "price_range": { "min": 450.00, "max": 2500.00, "currency": "GBP" }        │
│    },                                                                            │
│    "categories": {                                                               │
│      "cheapest": { "label": "Cheapest", "flights": [...] },                      │
│      "fastest": { "label": "Fastest", "flights": [...] },                        │
│      "best_value": { "label": "Best Value", "flights": [...] }                   │
│    }                                                                             │
│  }                                                                               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ITERATION 3: LLM Generates Final Response                                      │
│                                                                                  │
│  LLM sees search_flights result and generates user-facing message:              │
│                                                                                  │
│  LLM OUTPUT: AIMessage                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  "Great news! I found 45 flights from London Heathrow (LHR) to          │   │
│  │   New York JFK on April 26, 2026! ✈️                                     │   │
│  │                                                                          │   │
│  │   Here are your best options:                                            │   │
│  │                                                                          │   │
│  │   💵 Cheapest:                                                           │   │
│  │   1. British Airways BA117 - £450 - Departs 09:30, arrives 12:30        │   │
│  │   2. Virgin Atlantic VS3 - £485 - Departs 11:00, arrives 14:15          │   │
│  │   3. American Airlines AA107 - £520 - Departs 14:00, arrives 17:30      │   │
│  │                                                                          │   │
│  │   ⚡ Fastest:                                                             │   │
│  │   1. British Airways BA177 - £680 - 7h 45m direct                        │   │
│  │   2. Virgin Atlantic VS3 - £485 - 8h 15m direct                          │   │
│  │   3. Delta DL1 - £750 - 8h 20m direct                                    │   │
│  │                                                                          │   │
│  │   Which option would you like to book? Just say 'book option 1'          │   │
│  │   or tell me which one catches your eye!"                                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ReAct loop ends (no more tool calls needed)                                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 5: Response Processing and State Persistence

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 7: Result Processing in flight_graph.py                                   │
│                                                                                  │
│  # Extract flight search results from tool messages                             │
│  flight_results = _extract_flight_search_results(new_messages)                  │
│                                                                                  │
│  # Build frontend-compatible response                                           │
│  return {                                                                        │
│    "message": response_message,                                                 │
│    "type": "flight_search_results",  # Frontend renders FlightResultsCard      │
│    "data": {                                                                    │
│      "search_params": {...},                                                    │
│      "summary": {...},                                                          │
│      "categories": {...}                                                        │
│    },                                                                           │
│    "flights": unique_flights,                                                   │
│    "session_id": flightlogic_session_id,                                        │
│    "message_id": message_id,  # For Langfuse feedback correlation               │
│  }                                                                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 8: State Persistence                                                      │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │  MongoDB Checkpointer (Automatic via LangGraph)                         │    │
│  │  Collection: checkpoints                                                 │    │
│  │                                                                          │    │
│  │  Document stored:                                                        │    │
│  │  {                                                                       │    │
│  │    "thread_id": "chat_abc123",                                           │    │
│  │    "checkpoint": {                                                       │    │
│  │      "v": 1,                                                             │    │
│  │      "ts": "2026-01-29T10:30:00Z",                                       │    │
│  │      "channel_values": {                                                 │    │
│  │        "messages": [HumanMessage(...), AIMessage(...), ...],             │    │
│  │        "user_id": "user_123",                                            │    │
│  │        "chat_id": "chat_abc123",                                         │    │
│  │        "flight": {                                                       │    │
│  │          "origin": "LHR",                                                │    │
│  │          "origin_name": "London Heathrow Airport",                       │    │
│  │          "destination": "JFK",                                           │    │
│  │          "destination_name": "John F. Kennedy International Airport",    │    │
│  │          "departure_date": "2026-04-26",                                 │    │
│  │          "return_date": null,                                            │    │
│  │          "adults": 1,                                                    │    │
│  │          "children": 0,                                                  │    │
│  │          "infants": 0                                                    │    │
│  │        },                                                                │    │
│  │        "flight_results": [...],  # Curated flight options               │    │
│  │        "response_type": "flight_search_results"                          │    │
│  │      }                                                                   │    │
│  │    }                                                                     │    │
│  │  }                                                                       │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │  Booking Session Storage                                                │    │
│  │  File: backend_python/app/domains/booking_sessions/service.py           │    │
│  │                                                                          │    │
│  │  await BookingSessionService.store_session(                              │    │
│  │    session_id=chat_id,                                                   │    │
│  │    user_id=str(user.id),                                                 │    │
│  │    session_data={"session_type": "flight"},                              │    │
│  │    ttl_hours=2                                                           │    │
│  │  )                                                                       │    │
│  │                                                                          │    │
│  │  Purpose: Enables sticky routing - next message routes to flight agent  │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐    │
│  │  Chat History Storage                                                   │    │
│  │  File: backend_python/app/domains/chat/repository.py                    │    │
│  │                                                                          │    │
│  │  # Store user message                                                    │    │
│  │  await create_message(                                                   │    │
│  │    content={"text": message},                                            │    │
│  │    user_id=user_id,                                                      │    │
│  │    chat_id=chat_id,                                                      │    │
│  │    sender=MessageSender.USER,                                            │    │
│  │    intent_name="book_flight",                                            │    │
│  │    action_data={"confidence": 0.95}                                      │    │
│  │  )                                                                       │    │
│  │                                                                          │    │
│  │  # Store bot response                                                    │    │
│  │  await create_message(                                                   │    │
│  │    content={"text": response["message"]},                                │    │
│  │    user_id=user_id,                                                      │    │
│  │    chat_id=chat_id,                                                      │    │
│  │    sender=MessageSender.BOT,                                             │    │
│  │    intent_name="book_flight",                                            │    │
│  │    action="flight_search_results",                                       │    │
│  │    action_data={"type": "flight_results", "count": 45}                   │    │
│  │  )                                                                       │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STEP 9: HTTP Response                                                          │
│                                                                                  │
│  return ChatResponse(                                                           │
│    message="Great news! I found 45 flights from...",                            │
│    message_id="msg_xyz789",  # For feedback correlation                         │
│    chat_id="chat_abc123",                                                       │
│    intent_name="book_flight",                                                   │
│    confidence=0.95,                                                             │
│    type="flight_search_results",                                                │
│    data={                                                                       │
│      "data": {...},  # summary, categories                                      │
│      "flights": [...],                                                          │
│      "session_id": "FL_ABC123..."                                               │
│    }                                                                            │
│  )                                                                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component-by-Component Breakdown

### 1. Chat API Router (`app/api/chat.py`)

**Role**: HTTP endpoint that receives user messages and returns AI responses.

**Key Responsibilities**:
- Authenticate user via `require_authenticated` dependency
- Acquire distributed lock to prevent race conditions on same `chat_id`
- Delegate processing to `ChatService`

```python
@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest, user: UserPublic = Depends(require_authenticated)
) -> ChatResponse:
```

### 2. ChatService (`app/domains/chat/service.py`)

**Role**: Central orchestrator that routes messages to appropriate handlers.

**Key Responsibilities**:
- Check for active booking sessions (flight/hotel/itinerary)
- Run Intent Recognizer if no active session
- Route to appropriate LangGraph agent or legacy handler
- Store messages in chat history

**Priority Order**:
1. Active n8n itinerary session → Route to n8n
2. LangGraph Router (if feature flag enabled)
3. Active LangGraph booking session → Continue with that agent
4. Intent Recognition → Route based on detected intent

### 3. Intent Recognizer (`app/ai/intent_recognizer.py`)

**Role**: Classify user message intent using a 4-layer cascade architecture.

**Cascade Layers**:

| Layer | Name | Speed | Coverage | Purpose |
|-------|------|-------|----------|---------|
| 1 | Sticky Session | 1ms | 40% | Continue active booking flow |
| 2 | Explicit Patterns | 2ms | 30% | Match "book flight to..." patterns |
| 3 | Keyword Heuristics | 5ms | 25% | Weighted keyword scoring |
| 4 | LLM Classifier | 800ms | 5% | Ambiguous messages only |

**Supported Intents**:
- `BOOK_FLIGHT` - Flight booking
- `BOOK_HOTEL` - Hotel booking
- `CREATE_ITINERARY` - Trip planning
- `VIEW_BOOKINGS` - Show user's bookings
- `GENERAL_QUERY` - Travel questions

### 4. LangGraph Flight Agent (`app/ai/graph/flight_graph.py`)

**Role**: ReAct agent that handles flight booking conversations.

**Architecture**:
```python
_compiled_graph = create_react_agent(
    llm=ChatGoogleGenerativeAI(model="gemini-2.0-flash"),
    tools=[resolve_airport, parse_dates, search_flights],
    checkpointer=MongoDBSaver(...),
    state_schema=FlightState,
    prompt=FLIGHT_SYSTEM_PROMPT,
)
```

**Tools Available**:

| Tool | Purpose | File |
|------|---------|------|
| `resolve_airport` | Convert city/airport names to IATA codes | `tools/airport.py` |
| `parse_dates` | Parse natural language dates | `tools/dates.py` |
| `search_flights` | Search FlightLogic API | `tools/flights.py` |

### 5. Flight Search Tool (`app/ai/graph/tools/flights.py`)

**Role**: Execute flight searches against FlightLogic API.

**Process**:
1. Validate IATA codes
2. Build `FlightSearchRequest` with segments
3. Call `FlightLogicClient.search_flights()`
4. Process `FareItinerary` objects
5. Apply platform fees
6. Curate into categories (cheapest, fastest, best_value)
7. Return structured results

### 6. FlightLogic Integration (`integrations/flightlogic/client.py`)

**Role**: HTTP client for external FlightLogic travel API.

**Operations**:
- Flight search
- Price revalidation
- Booking creation
- Booking retrieval

---

## State Management in LangGraph

### Overview

LangGraph uses a **checkpoint-based state management** system that automatically persists conversation state to MongoDB. This enables:

1. **Multi-turn conversations**: State survives across HTTP requests
2. **Session continuity**: Resume conversations after browser refresh
3. **Parallel safety**: Each `thread_id` has isolated state

### State Schema Definition

**File**: `backend_python/app/ai/graph/state.py`

```python
class FlightParams(TypedDict, total=False):
    """Collected flight search parameters - progressively collected."""
    
    origin: str | None              # IATA code (e.g., "LHR")
    origin_name: str | None         # Display name (e.g., "London Heathrow")
    origin_is_city: bool | None     # True if user said city name
    destination: str | None         # IATA code
    destination_name: str | None    # Display name
    destination_is_city: bool | None
    departure_date: str | None      # YYYY-MM-DD format
    return_date: str | None         # YYYY-MM-DD (None for one-way)
    adults: int                     # Default: 1
    children: int                   # Default: 0
    infants: int                    # Default: 0


class FlightState(TypedDict):
    """Complete state for flight booking conversation."""
    
    # Message history (accumulated via add_messages reducer)
    messages: Annotated[list[BaseMessage], add_messages]
    
    # Identifiers
    user_id: str
    chat_id: str
    
    # Flight parameters (progressively collected)
    flight: FlightParams
    
    # Search results (set after search)
    flight_results: list[dict[str, Any]] | None
    
    # Selected flight (set after user selection)
    selected_flight: dict[str, Any] | None
    
    # Response formatting for frontend
    response_type: str
    response_data: dict[str, Any] | None
    
    # LangGraph internal (recursion limit tracking)
    remaining_steps: int
```

### State Storage: MongoDB Checkpointer

**Initialization** (in `flight_graph.py`):

```python
def _get_checkpointer() -> MongoDBSaver:
    """Get or create MongoDB checkpointer singleton."""
    global _checkpointer, _mongo_client
    
    if _checkpointer is None:
        _mongo_client = MongoClient(settings.MONGODB_URI)
        _checkpointer = MongoDBSaver(
            _mongo_client,
            db_name=settings.DATABASE_NAME,
        )
    
    return _checkpointer
```

**How State is Keyed**:

```python
config = {
    "configurable": {
        "thread_id": chat_id  # Unique conversation identifier
    }
}
result = await graph.ainvoke(input_state, config)
```

- `thread_id` = `chat_id` = Conversation identifier
- Each unique `thread_id` has its own isolated state
- State automatically loads on invoke, saves after completion

### State Flow Example

```
Turn 1: "Book a flight from London to Paris"
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Initial State (empty checkpoint)                                               │
│  {                                                                              │
│    messages: [],                                                                │
│    flight: {},                                                                  │
│    flight_results: null                                                         │
│  }                                                                              │
│                                                                                  │
│  After LLM processing + tool calls:                                             │
│  {                                                                              │
│    messages: [HumanMessage, AIMessage (with tool calls), ToolMessage x3, AI],   │
│    flight: {                                                                    │
│      origin: "LHR",                                                             │
│      destination: "CDG",                                                        │
│      // departure_date not yet set                                              │
│    },                                                                           │
│    flight_results: null                                                         │
│  }                                                                              │
│                                                                                  │
│  AI Response: "London has several airports. Did you mean Heathrow (LHR)?"       │
│                                                                                  │
│  State saved to MongoDB checkpoint                                              │
└─────────────────────────────────────────────────────────────────────────────────┘

Turn 2: "Yes, Heathrow, on April 26"
┌─────────────────────────────────────────────────────────────────────────────────┐
│  State loaded from checkpoint (via thread_id)                                   │
│                                                                                  │
│  After LLM processing:                                                          │
│  {                                                                              │
│    messages: [...previous..., HumanMessage, AIMessage, ToolMessage, AIMessage], │
│    flight: {                                                                    │
│      origin: "LHR",                                                             │
│      origin_name: "London Heathrow Airport",                                    │
│      destination: "CDG",                                                        │
│      destination_name: "Paris Charles de Gaulle",                               │
│      departure_date: "2026-04-26",                                              │
│      adults: 1                                                                  │
│    },                                                                           │
│    flight_results: [{...}, {...}, {...}]  // Curated results                    │
│  }                                                                              │
│                                                                                  │
│  AI Response: "Found 45 flights! Here are your best options..."                 │
│                                                                                  │
│  State saved to MongoDB checkpoint                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Message Reducer: `add_messages`

The `messages` field uses LangGraph's `add_messages` reducer:

```python
messages: Annotated[list[BaseMessage], add_messages]
```

**Behavior**:
- New messages are **appended** to existing history (not replaced)
- Handles message ID deduplication
- Enables conversational context across turns

### State vs Booking Session

| Storage | Purpose | Scope | TTL |
|---------|---------|-------|-----|
| LangGraph Checkpoint | Full conversation state (messages, params, results) | Per graph (flight/hotel) | Permanent (MongoDB) |
| BookingSessionService | Routing hint (`session_type: "flight"`) | Chat-level | 2 hours |
| Chat Repository | Message history for UI display | User-level | Permanent |

### Accessing State Programmatically

```python
# Get current checkpoint state
graph = get_flight_graph()
config = {"configurable": {"thread_id": chat_id}}
state_snapshot = graph.get_state(config)

if state_snapshot and state_snapshot.values:
    current_flight_params = state_snapshot.values.get("flight", {})
    existing_messages = state_snapshot.values.get("messages", [])
```

### State Initialization Patterns

**New Conversation**:
```python
input_state = {
    "messages": [HumanMessage(content=message)],
    "user_id": user_id,
    "chat_id": chat_id,
    "flight": {},  # Empty, will be populated by tools
}
```

**Continuing Conversation**:
```python
# LangGraph automatically loads previous state via thread_id
# Only send new message - state is merged automatically
input_state = {
    "messages": [HumanMessage(content=message)],
}
```

**Pre-populated Parameters** (from itinerary/supervisor):
```python
input_state = {
    "messages": [HumanMessage(content=message)],
    "user_id": user_id,
    "chat_id": chat_id,
    "flight": {
        "origin": "LHR",
        "destination": "JFK",
        "departure_date": "2026-04-26",
        "adults": 1,
    },
}
```

---

## Key Files Reference

### Core Files

| File | Purpose |
|------|---------|
| `app/api/chat.py` | HTTP endpoint for chat messages |
| `app/domains/chat/service.py` | Message routing and orchestration |
| `app/ai/intent_recognizer.py` | Intent classification (4-layer cascade) |
| `app/ai/graph/flight_graph.py` | LangGraph flight agent entry point |
| `app/ai/graph/state.py` | State schema definitions (FlightState, HotelState, etc.) |

### Tools

| File | Tool | Purpose |
|------|------|---------|
| `app/ai/graph/tools/airport.py` | `resolve_airport` | City/code → IATA |
| `app/ai/graph/tools/dates.py` | `parse_dates` | NL dates → YYYY-MM-DD |
| `app/ai/graph/tools/flights.py` | `search_flights` | FlightLogic API search |

### State Management

| File | Purpose |
|------|---------|
| `app/ai/graph/state.py` | TypedDict state schemas |
| `app/ai/graph/flight_graph.py:_get_checkpointer()` | MongoDB checkpointer singleton |
| `app/domains/booking_sessions/service.py` | Session routing hints |
| `app/domains/chat/repository.py` | Chat message persistence |

### External Integrations

| File | Purpose |
|------|---------|
| `integrations/flightlogic/client.py` | FlightLogic API HTTP client |
| `integrations/llm/gemini.py` | Google Gemini LLM service |
| `app/ai/graph/tracing.py` | Langfuse observability integration |

---

## Summary

For the example message "Book a flight for me from LHR to JFK on 26 April 2026...":

1. **Entry**: HTTP POST to `/api/chat/message`
2. **Routing**: Intent Recognizer → `BOOK_FLIGHT` (0.95 confidence)
3. **Agent**: LangGraph flight agent (ReAct pattern)
4. **Tools**: 
   - `resolve_airport("LHR")` → Verified LHR
   - `resolve_airport("JFK")` → Verified JFK
   - `parse_dates("26 April 2026")` → "2026-04-26"
   - `search_flights(...)` → FlightLogic API → Curated results
5. **State**: Saved to MongoDB via checkpointer (thread_id = chat_id)
6. **Response**: `ChatResponse` with `type="flight_search_results"`

The entire flow is stateful via LangGraph's MongoDB checkpointer, enabling multi-turn booking conversations where each turn builds on the previous state.
