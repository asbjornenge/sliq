type storage = unit

let nothing : operation list * unit = [], ()

let%entry test (_param : unit) (_storage : unit) =
    nothing
