external get_balance :
    [%stack: address] -> [%stack: tez]
    = "GET_BALANCE"
external get_storage :
    [%type: 'a] -> [%stack: address] -> [%stack: 'a option]
    = "GET_STORAGE"
external apply_operations :
    [%stack: operation list] -> unit
    = "APPLY_OPERATIONS"
external start_set_source :
    [%stack: address] -> unit
    = "SET_SOURCE { #"
external end_set_source :
    unit -> unit
    = "}"
external must_fail :
    [%stack: operation] -> [%stack: operation]
    = "{ NONE string ; MUST_FAIL string }"
external print_stack :
    unit -> unit
    = "PRINT_STACK"
external step :
    unit -> unit
    = "STEP"
