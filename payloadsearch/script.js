console.log("Script file loaded")



// VARIABLES
date_url = "https://tpietersetelus.github.io/dutchtools/data/payloadsearch/update_date.txt"
payload_url = "https://tpietersetelus.github.io/dutchtools/data/payloadsearch/encrypted_data.txt"

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



function read_dropdown_value(input_id){
    var dropdown_menu = document.getElementById(input_id);
    var selected_option = dropdown_menu.value;    
    return selected_option;
}



function decode_hex(input_text){
    bytes = [...input_text.matchAll(/[0-9a-f]{2}/g)].map(a => parseInt(a[0], 16));
    return new TextDecoder().decode(new Uint8Array(bytes));
}



function process_payload_data(input_data){
    separated_array = input_data.split(String.raw`*`);
    payload_file_dict = {}
    for (const elem of separated_array){
        lines = elem.split("\n")
        lines = lines.filter(item => item); // Get rid of empty lines (?)

        path = decode_hex(lines[0]);
        lang = decode_hex(lines[1]);
        textcontent = decode_hex(lines[2]);
        payload_file_dict[path] = {"lang": lang, "content": textcontent};
    }

    return payload_file_dict;
}



function set_results_list(input_list, input_id){
    var ul = document.getElementById(input_id);
    ul.innerHTML = ""; // Get rid of existing stuff
    for (const elem of input_list){
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(elem));
        ul.appendChild(li);
    }
}


function file_list_language_filter(input_dict, input_lang){
    filtered_dict = {};
    lang_path_string = String.raw`/${input_lang}/`;
    for (const elem of Object.keys(input_dict)){
        if (elem.includes(lang_path_string)){
            filtered_dict[elem] = input_dict[elem];
        }
    }
    return filtered_dict;
}



function set_content_by_id(input_id, input_content){
    var span = document.getElementById(input_id);
    span.innerHTML = input_content;
}



// UPDATE FUNCTION
function update_all(){
    // Get values of search/options
    language_dropdown_value = read_dropdown_value("langselect");
    target_dropdown_value = read_dropdown_value("targetselect");

    // Filtering
    payloads_filtered_by_language = file_list_language_filter(processed_payload_data, language_dropdown_value);

    // TEMPORARY, IMPROVE THIS:
    selected_file_list = Object.keys(payloads_filtered_by_language);

    // Add selected file names to search result list
    set_results_list(selected_file_list, "searchresults");
    // Run update for the first time
    
    
}



// MAIN FUNCTION CALL
async function main(){

    last_updated_text = synchronousRequest(date_url);
    set_content_by_id("last_dynamic", last_updated_text)

    raw_payload_data = synchronousRequest(payload_url);
    processed_payload_data = process_payload_data(raw_payload_data);

    
    
    
    
    
    update_all();
}



main().catch(console.log);



// (c) 2023 Tommy Pieterse