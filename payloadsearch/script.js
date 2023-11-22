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


function process_payload_data(input_data){
    separated_array = input_data.split(String.raw`*`);
    payload_files = []
    for (const elem of separated_array){
        lines = elem.split("\n")
        lines = lines.filter(item => item); // Get rid of empty lines (?)

        file_dict = {}
        file_dict["path"] = lines[0]
        file_dict["lang"] = lines[1]
        file_dict["text"] = lines[2]
        payload_files.push(file_dict)
    }

    return payload_files;
}
////bla


// UPDATE FUNCTION
function update_all(){

    // bla

}



// MAIN FUNCTION CALL
async function main(){
    raw_payload_data = synchronousRequest(payload_url);
    processed_payload_data = process_payload_data(raw_payload_data);

    // blabla

    // Run update for the first time
    update_all();
}



main().catch(console.log);



// (c) 2023 Tommy Pieterse