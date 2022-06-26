const hello =
  ["Hey", "Bonjour", "Hola", "Ciao", "Olá", "Kia Ora", "G’day", "Geia", "Zdravo", "Zdravo", "Privet", "Nǐhǎo", "Nǐhǎo",
    "Namaste", "Kon’nichiwa", "Merhaba", "Ahoj", "Gutentag", "Hallo", "Cześć", "S̄wạs̄dī", "Szia", "Ahoj",
    "Hyālō", "Salām", "Dobryj Den", "Hallå", "Hallo", "Bunâ", "Shalom", "Barev", "Marhabaan",
    "Sata SrīAkāla", "halo", "Pagi", "Xin Chào", "Kaixo", "Servus", "Kamusta", "Jambo", "Salom", "Salam", "Slav", "Namaste",
    "Bonjou", "Dobry Dzień", "Moni", "Bula", "Aloha", "Tālofa", "Mālōelelei", "A Gutn Tog", "S’mae", "Hei", "Sveiki", "Halló",
    "Halò", "Dia Duit", "Tere", "Zdravo", "Tashi Delek", "Sabaidee", "Gamarjoba", "Dumela", "Saluton", "Bongu", "Hello",
    "Nde-ewo", "Moïen", "Ya’at’eeh", "Swiss Grüezi", "Ia Orana", "Përshëndetje", "Hola", "Ola", "Sainuu",
    "Nónggō", "Vanakkam", "Salam", "Namaskāra", "Sannu", "Mingalaba", "Selam", "Demat", "Akkam", "Khurumjari", "Kumusta",
    "Salama", "Hendaho", "Choum Reap Sor", "Ayubowan", "Salam Alaykum", "Li-hó", "Dumela", "Allianchu", "Molweni"]

let index = 0;
const helloText = document.getElementById("hello");
let word;
const cursor = document.getElementById("cursor");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function change() {
    index = index%hello.length;
    word = hello[index] + "!"
    cursor.classList.remove("blinking");
    for (let i = 1; i <= word.length; i++) {
        helloText.innerHTML = word.substr(0, i)
        await sleep(200);
    }
    cursor.classList.add("blinking");
    index++;
    await sleep(1500);
    await change();
}

change();