console.log("Script file loaded")



// VARIABLES
verbs_url = "https://tpietersetelus.github.io/dutchtools/data/verbs.txt";


// FUNCTIONS
function synchronousRequest(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status === 200) {
       return xhr.responseText;
    } else {
       throw new Error('Request failed: ' + xhr.statusText);
    }
 }



function process_verbdata(input_text){
    verb_array = input_text.split("=");

    verb_array_decomposed = [];
    for (const elem of verb_array) {
        subelems = elem.split("\n");
        subelems = subelems.filter(item => item);
        if (subelems.length != 0){
            verb_array_decomposed.push(subelems);
        }
      }
    
    return verb_array_decomposed;
}



function get_verbnames(input_array){
    verbname_array = [];
    for (const elem of input_array){
        verbname_array.push(elem[0]);
    }

    verbname_array = verbname_array.filter(item => item); // Remove empty items
    return(verbname_array);
}



function get_verb_support(input_array){
    unsupported_verbs = [];
    for (const elem of input_array){
        if (elem.length == 1){ // Check if there's even a next line to check
            // Do nothing
        }else{
            if(elem[1].startsWith("!")){ // Check if next line starts normally

            }else{ // If not normal, make unsupported
                unsupported_verbs.push(elem[0]);
            }       
        }
    }

    return unsupported_verbs;
}


function get_split_verbs(input_array){
    split_dict = {}
    for (const elem of input_array){
        if (elem.length == 1){ // Check if there's even a next line to check
            // No split lines possible, so do nothing
        } else{ // If there are next lines

            split_verbdata = [];

            for (const line of elem) // Go over each of them
                if (line.startsWith("!")){ // If it's a split verb data line
                    edited_line = line.replace("!", "");
                    edited_line_array = edited_line.split(String.raw`/`);
                    split_verbdata.push(edited_line_array); // Add to split verb list
                }
            
            if (split_verbdata.length > 0){ // If there are split verbs
                split_dict[elem[0]] = split_verbdata; // Add the data to the dictionary under the name of the verb
            }
        }
    }

    return split_dict;

}

function add_verbnames_to_dropdown(input_verbnames, verb_support){
    for (const elem of input_verbnames){
        var option = document.createElement('option');
        option.value = elem; // Set value to elem
        if(verb_support.includes(elem)){
            option.text = elem + " (UNSUPPORTED)"; // Set text to elem
        }else{
            option.text = elem; // Set text to elem
        }
        document.getElementById("verbselect").options.add(option);
 	}
}



function read_textarea_contents(input_id){
    content = document.getElementById(input_id).value;
    return content;
}


function read_dropdown_value(input_id){
    var dropdown_menu = document.getElementById(input_id);
    var selected_option = dropdown_menu.value;    
    return selected_option;

}

function read_checkmark_status(input_id){
    checked_status = document.getElementById(input_id).checked;
    return checked_status;
}

function edit_phrase(input_text, input_checkmark){
    if (input_checkmark == true){
        check_text = input_text.replaceAll(" ", ""); // Get rid of any spaces for the check
        if (check_text.length != 0){ // If text not empty
            return input_text;
        }else{ // If text empty
            return "?"; // Return question mark
        }
    }else{
        return ""; // Return empty string
    }
}



function generate_prefixes_output(){
    slot_inf = String.raw`  $inf_prefix: !include opt/payload/nl_NL/verbs/inf_prefix.yaml`;
    slot_stem_t = String.raw`  $stem_t_prefix: !include opt/payload/nl_NL/verbs/stem_t_prefix.yaml`;
    combined_slots = [slot_inf, slot_stem_t].join("\n");
    return combined_slots;
}


function generate_verbslots_output(input_verbname){
    slot_inf = String.raw`  $${input_verbname}_inf: !include opt/payload/nl_NL/verbs/${input_verbname}/infinitive.yaml`;
    slot_stem = String.raw`  $${input_verbname}_stem: !include opt/payload/nl_NL/verbs/${input_verbname}/stem.yaml`;
    slot_stem_t = String.raw`  $${input_verbname}_stem_t: !include opt/payload/nl_NL/verbs/${input_verbname}/stem_t.yaml`;
    combined_slots =  [slot_inf, slot_stem, slot_stem_t].join("\n");
    return combined_slots;
}

function set_output_text(input_id, input_text){
    document.getElementById(input_id).innerHTML = input_text;
}

function hide_unhide_optional_sample(input_checkmark, input_class){
    if (input_checkmark == false) {
        for (const element of document.querySelectorAll("."+input_class)) {
            element.style.display = "none";
        }
    } else {
        for (const element of document.querySelectorAll("."+input_class)) {
            element.style.display = "list-item";
        }
    }
}

function generate_samples_output(input_prefix, input_main, input_suffix){
    samples_dict = {};

    // Main sentences
    stem_full = String.raw`${input_prefix} <b>bewaar</b> ${input_main} ${input_suffix}`;
    samples_dict["stem_full"] = stem_full;
    
    stem_split = String.raw`${input_prefix} <b>sla</b> ${input_main} <b>op</b> ${input_suffix}`;
    samples_dict["stem_split"] = stem_split;
   
    inf = String.raw`${input_prefix} <b>kun je</b> ${input_main} <b>bewaren</b> ${input_suffix}`;    
    samples_dict["inf"] = inf;

    kunnen_full = String.raw`${input_prefix} <b>zou je</b> ${input_main} <b>kunnen bewaren</b> ${input_suffix}`;
    samples_dict["kunnen_full"] = kunnen_full;

    kunnen_split = String.raw`${input_prefix} <b>zou je</b> ${input_main} <b>op kunnen slaan</b> ${input_suffix}`;    
    samples_dict["kunnen_split"] = kunnen_split;

    stem_t = String.raw`${input_prefix} <b>ik wil dat je</b> ${input_main} <b>bewaart</b> ${input_suffix}`;
    samples_dict["stem_t"] = stem_t;

    // Optional sentences
    stem_split_infix = String.raw`${input_prefix} <b>sla</b> ${input_main} ${input_suffix} <b>op</b>`;
    samples_dict["stem_split_infix"] = stem_split_infix;

    inf_infix = String.raw`${input_prefix} <b>kun je</b> ${input_main} ${input_suffix} <b>bewaren</b>`;    
    samples_dict["inf_infix"] = inf_infix;

    kunnen_full_infix = String.raw`${input_prefix} <b>zou je</b> ${input_main} ${input_suffix} <b>kunnen bewaren</b>`;
    samples_dict["kunnen_full_infix"] = kunnen_full_infix;

    kunnen_split_infix = String.raw`${input_prefix} <b>zou je</b> ${input_main} ${input_suffix} <b>op kunnen slaan</b>`;    
    samples_dict["kunnen_split_infix"] = kunnen_split_infix;

    stem_t_infix = String.raw`${input_prefix} <b>ik wil dat je</b> ${input_main} <b>bewaart</b> ${input_suffix}`;
    samples_dict["stem_t_infix"] = stem_t_infix;

    return samples_dict;
}


function set_samples_output(input_dict){
    set_output_text("sample_stem_full", input_dict["stem_full"])
    set_output_text("sample_stem_split", input_dict["stem_split"])
    set_output_text("sample_inf", input_dict["inf"])
    set_output_text("sample_kunnen_full", input_dict["kunnen_full"])
    set_output_text("sample_kunnen_split", input_dict["kunnen_split"])
    set_output_text("sample_stem_t", input_dict["stem_t"])
    set_output_text("sample_stem_split_infix", input_dict["stem_split_infix"])
    set_output_text("sample_inf_infix", input_dict["inf_infix"])
    set_output_text("sample_kunnen_full_infix", input_dict["kunnen_full_infix"])
    set_output_text("sample_kunnen_split_infix", input_dict["kunnen_split_infix"])
    set_output_text("sample_stem_t_infix", input_dict["stem_t_infix"])
}



function generate_utterances_output(input_prefix, input_main, input_suffix, input_verbname, input_splitdict, input_infix_check){
    utterances = [];


    // Generate stem full
    stem_full = String.raw`- ${input_prefix} $${input_verbname}_stem ${input_main} ${input_suffix}`;
    utterances.push(stem_full);


    // Generate stem split + infix
    if (input_verbname in input_splitdict){
        for (const elem of input_splitdict[input_verbname]){
            split_part = elem[0]
            split_stem = elem[2]
            
            
            stem_split = String.raw`- ${input_prefix} ${split_stem} ${input_main} ${split_part} ${input_suffix}`;
            utterances.push(stem_split);

            if (input_infix_check == true){
                stem_split_infix = String.raw`- ${input_prefix} ${split_stem} ${input_main} ${input_suffix} ${split_part}`;
                utterances.push(stem_split_infix);
            }
        }
    }


    // Generate inf + infix

    inf = String.raw`- ${input_prefix} ($inf_prefix|) ${input_main} $${input_verbname}_inf ${input_suffix}`
    utterances.push(inf);

    if (input_infix_check == true){
        inf_infix = String.raw`- ${input_prefix} ($inf_prefix|) ${input_main} ${input_suffix} $${input_verbname}_inf`
        utterances.push(inf_infix);
    }


    // Generate kunnen full + infix

    kunnen_full = String.raw`- ${input_prefix} zou (je|jij) ${input_main} (kunnen|willen) $${input_verbname}_inf ${input_suffix}`;
    utterances.push(kunnen_full)

    if (input_infix_check == true){
        kunnen_full_infix = String.raw`- ${input_prefix} zou (je|jij) ${input_main} ${input_suffix} (kunnen|willen) $${input_verbname}_inf`;
        utterances.push(kunnen_full_infix);
    }


    // Generate kunnen split + infix

    if (input_verbname in input_splitdict){
        for (const elem of input_splitdict[input_verbname]){
            split_part = elem[0]
            split_inf = elem[1]
            
            
            kunnen_split = String.raw`- ${input_prefix} zou (je|jij) ${input_main} ${split_part} (kunnen|willen) ${split_inf} ${input_suffix}`;
            utterances.push(kunnen_split);

            if (input_infix_check == true){
                stem_split_infix = String.raw`- ${input_prefix} zou (je|jij) ${input_main} ${input_suffix} ${split_part} (kunnen|willen) ${split_inf}`;
                utterances.push(stem_split_infix);
            }
        }
    }


    // Generate stem+t + infix

    stem_t = String.raw`- ${input_prefix} $stem_t_prefix ${input_main} $${input_verbname}_stem_t ${input_suffix}`;
    utterances.push(stem_t);

    if (input_infix_check == true){
        stem_t_infix = String.raw`- ${input_prefix} $stem_t_prefix ${input_main} ${input_suffix} $${input_verbname}_stem_t`;
        utterances.push(stem_t_infix);
    }













    // Remove duplicate spaces
    edited_utterances = [];
    for (const elem of utterances){
        trimmed = elem.replace(/ +(?= )/g,'');
        edited_utterances.push(trimmed);
    }

    // Generate inf + infix
    combined_utterances = edited_utterances.join("\n");
    return combined_utterances;
}

// BUTTON FUNCTIONS
//// ADD
function copy_contents_single(input_id){
    var copyText = document.getElementById(input_id);
	var textArea = document.createElement("textarea");
	textArea.value = copyText.textContent + "\n"; // Adds an extra newline
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand("Copy");
	textArea.remove();
}



function copy_contents_double(input_id_1, input_id_2){
    var copyText_1 = document.getElementById(input_id_1);
    copyText_1 = copyText_1.textContent;
    var copyText_2 = document.getElementById(input_id_2);
    copyText_2 = copyText_2.textContent;
    combined_copyText = [copyText_1, copyText_2].join("\n")

	var textArea = document.createElement("textarea");
	textArea.value = combined_copyText + "\n"; // Adds an extra newline
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand("Copy");
	textArea.remove();
}



// UPDATE FUNCTION
function update_all(){

    // Get textarea contents
    prefix_text_content = read_textarea_contents("prefix");
    main_text_content = read_textarea_contents("phrase");
    suffix_text_content = read_textarea_contents("suffix");

    // Get checkmark statuses
    prefix_checkmark_status = read_checkmark_status("prefixcheck");
    main_checkmark_status = read_checkmark_status("phrasecheck");
    suffix_checkmark_status = read_checkmark_status("suffixcheck");

    // Get edited phrases
    prefix_edited_phrase = edit_phrase(prefix_text_content, prefix_checkmark_status);
    main_edited_phrase = edit_phrase(main_text_content, main_checkmark_status);
    suffix_edited_phrase = edit_phrase(suffix_text_content, suffix_checkmark_status);

    // Get verb name
    selected_verb = read_dropdown_value("verbselect");

    // Get and hide/reveal infix option stuff
    infix_option_checkmark_status = read_checkmark_status("addinfixcheck");
    hide_unhide_optional_sample(infix_option_checkmark_status, "infixsample");
    
    // Generate and set prefix slots
    prefixes_slot_output = generate_prefixes_output();
    set_output_text("slotprefix", prefixes_slot_output);

    // Generate and set verb slots
    verbs_slot_output = generate_verbslots_output(selected_verb);
    set_output_text("slotverb", verbs_slot_output);






    // Generate and set samples
    samples_output = generate_samples_output(prefix_edited_phrase, main_edited_phrase, suffix_edited_phrase);
    set_samples_output(samples_output);


    // Generate and set utterances
    utterances_output = generate_utterances_output(prefix_edited_phrase, main_edited_phrase, suffix_edited_phrase, selected_verb, split_verbs_dict, infix_option_checkmark_status);
    set_output_text("utterances", utterances_output);

    // Generate utterances


}



// MAIN FUNCTION CALL
async function main(){
    // One-time beginning stuff

    // Request verb file
    raw_verbdata = synchronousRequest(verbs_url);

    // Turn verb file contents into an array with blocks
    processed_verbdata = process_verbdata(raw_verbdata);

    // Get an array of all verb names
    verbnames = get_verbnames(processed_verbdata);

    // Get names of unsupported verbs
    unsupported_verbnames = get_verb_support(processed_verbdata);

    // Get split verbs for each verb
    split_verbs_dict = get_split_verbs(processed_verbdata);

    // Add verb names to verb selection drop-down box
    add_verbnames_to_dropdown(verbnames, unsupported_verbnames);



    // Run update for the first time
    update_all();
}



main().catch(console.log);



// (c) 2023 Tommy Pieterse