type storage = unit

let nothing : operation list * unit = [], ()

let%entry test (_param : unit) (_storage : unit) =
    let delegate : key_hash option = None in
    let operation, address =
        Account.create
            ~manager:tz1YLtLqD1fWHthSVHPD116oYvsd4PTAHUoc
            ~delegate
            ~delegatable:true
            ~amount:13tz
    in
    (* Apply the operation so that we can interact with the account. *)
    Techel.apply_operations [operation];

    (* Contract is now live. *)
    let balance = Techel.get_balance address in
    if balance <> 13tz then (
        failwith "balance should be 13tz"
    );

    let account_contract =
        match UnitContract.at address with
        | None -> failwith "could not retrieve account"
        | Some c -> c
    in

    let operation = Contract.call ~dest:account_contract ~amount:29tz ~parameter:() in
    Techel.apply_operations [operation];

    let balance = Techel.get_balance address in
    if balance <> 42tz then (
        failwith "balance should be 42tz"
    );

    nothing

