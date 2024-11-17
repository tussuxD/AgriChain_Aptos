module agrichain::report {
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::signer;
    
    const ENO_REPORT_LIST: u64 = 1;
    const ENOT_ADMIN: u64 = 2;

    struct Report has store, drop {
        timestamp: u64,
        crops: String,
        state: String,
        price: u64,
        quantity: u64,
        terms: String,
        payment: u64,
        from: address
    }

    struct ReportList has key {
        reports: vector<Report>,
        admins: vector<address>
    }

    // View all reports - return report data as individual vectors
    #[view]
    public fun view_reports(): (
        vector<u64>,    // timestamps
        vector<String>, // crops
        vector<String>, // states
        vector<u64>,    // prices
        vector<u64>,    // quantities
        vector<String>, // terms
        vector<u64>,    // payments
        vector<address> // froms
    ) acquires ReportList {
        assert!(exists<ReportList>(@agrichain), ENO_REPORT_LIST);
        
        let report_list = borrow_global<ReportList>(@agrichain);
        
        let timestamps = vector::empty<u64>();
        let crops_list = vector::empty<String>();
        let states = vector::empty<String>();
        let prices = vector::empty<u64>();
        let quantities = vector::empty<u64>();
        let terms_list = vector::empty<String>();
        let payments = vector::empty<u64>();
        let froms = vector::empty<address>();

        let i = 0;
        let len = vector::length(&report_list.reports);
        while (i < len) {
            let report = vector::borrow(&report_list.reports, i);
            vector::push_back(&mut timestamps, report.timestamp);
            vector::push_back(&mut crops_list, *&report.crops);
            vector::push_back(&mut states, *&report.state);
            vector::push_back(&mut prices, report.price);
            vector::push_back(&mut quantities, report.quantity);
            vector::push_back(&mut terms_list, *&report.terms);
            vector::push_back(&mut payments, report.payment);
            vector::push_back(&mut froms, report.from);
            i = i + 1;
        };
        
        (timestamps, crops_list, states, prices, quantities, terms_list, payments, froms)
    }

    // Initialize module with admin
    fun init_module(account: &signer) {
        let admins = vector::empty<address>();
        vector::push_back(&mut admins, @0xf273b1e243a16ce1c331924890ba21cbbc62ef5823b05c9c77ba0d121da71be3);
        
        move_to(account, ReportList {
            reports: vector::empty<Report>(),
            admins
        });
    }

    // Check if address is admin
    public fun is_admin(addr: address): bool acquires ReportList {
        let report_list = borrow_global<ReportList>(@agrichain);
        vector::contains(&report_list.admins, &addr)
    }

    // Submit agricultural report
    public entry fun submit_report(
        account: &signer,
        crops: String,
        state: String,
        price: u64,
        quantity: u64,
        terms: String,
        payment: u64
    ) acquires ReportList {
        let addr = signer::address_of(account);
        assert!(addr != @0x0, 0); // Check for valid address
        
        if (!exists<ReportList>(@agrichain)) {
            move_to(account, ReportList {
                reports: vector::empty<Report>(),
                admins: vector::empty<address>()
            });
        };
        
        let report_list = borrow_global_mut<ReportList>(@agrichain);
        
        let new_report = Report {
            timestamp: timestamp::now_seconds(),
            crops,
            state,
            price,
            quantity,
            terms,
            payment,
            from: addr
        };
        vector::push_back(&mut report_list.reports, new_report);
    }

    // Add new admin - only existing admin can add
    public entry fun add_admin(
        account: &signer,
        new_admin: address
    ) acquires ReportList {
        let addr = signer::address_of(account);
        assert!(is_admin(addr), ENOT_ADMIN);
        
        let report_list = borrow_global_mut<ReportList>(@agrichain);
        if (!vector::contains(&report_list.admins, &new_admin)) {
            vector::push_back(&mut report_list.admins, new_admin);
        }
    }

    #[test_only]
    public fun setup_test(account: &signer) {
        init_module(account);
    }
}