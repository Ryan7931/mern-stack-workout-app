Samenvatting van wijzigingen en gedetailleerde code-uitleg (Nederlands)

1) Opgeloste beveiligingsbug — waarom andermans workouts konden worden verwijderd

- Probleem (kort): de backend gebruikte `findByIdAndDelete()` / `findByIdAndUpdate()` met een objectfilter. Dat negeert de `userId` wanneer je geen ID-argument geeft.

- Codevoorbeeld (fout):

```js
// foutieve aanroep — userId wordt niet gecontroleerd
await Workout.findByIdAndDelete({
  _id: id,
  userId: req.user._id
});
```

- Waarom dit fout gaat: `findByIdAndDelete()` verwacht een enkel id-argument (of een id-value), niet een filter-object. Mongoose zal het object behandelen als de id-waarde en de `userId`-eigenschap niet meenemen in de query.

- Oplossing: gebruik `findOneAndDelete()` / `findOneAndUpdate()` met hetzelfde filter-object zodat de database zoekt op zowel `_id` EN `userId`:

```js
// correcte aanroep — zoekt op id én owner
await Workout.findOneAndDelete({ _id: id, userId: req.user._id });
```

- Gevolg: de database geeft alleen een resultaat terug als de ingelogde gebruiker ook de eigenaar is. Anders krijg je `null` en stuur je een 404 terug.

Bestand aangepast:
- `backend/src/controllers/workoutController.js` — wijziging van `findByIdAndDelete`/`findByIdAndUpdate` naar `findOneAndDelete`/`findOneAndUpdate`.

2) Frontend: authenticatieflow en token-propagatie (uitleg van de code)

- Doel: token ophalen bij login/register, opslaan, en bij ALLE requests naar `/api/workouts` meesturen als `Authorization: Bearer <token>`.

- Belangrijke onderdelen en hoe ze samenwerken:

- `Login.jsx`:
  - Na succesvolle login wordt het ontvangen token opgeslagen en aan de parent-component doorgegeven:

```js
// in Login.jsx, na response.ok
localStorage.setItem('token', data.token);
if (onLoginSuccess) onLoginSuccess(data.token);
```

  - Door `onLoginSuccess` aan te roepen laat `App.jsx` weten dat er een token is en kan `App` state bijwerken.

- `Register.jsx` doet precies hetzelfde voor nieuwe gebruikers (slaat token op en roept parent callback aan).

- `App.jsx`:
  - `token` state wordt beheerd in `App`:

```js
const [token, setToken] = useState(() => localStorage.getItem('token') || null);
```

  - `handleLogin(newToken)` zet `token` in state (en `localStorage` is al gevuld door `Login`/`Register`).

  - `handleLogout()`:

```js
const handleLogout = () => {
  localStorage.removeItem('token');
  setToken(null);
  setWorkouts([]);
};
```

  - `fetchWorkouts()` haalt het token (uit `localStorage`) en voegt de header toe:

```js
const response = await fetch('/api/workouts', {
  headers: { Authorization: `Bearer ${token}` }
});
```

  - App rendert alleen de `Auth`-pagina wanneer `token` ontbreekt. Zodra `token` aanwezig is, toont App de `WorkoutForm` en `WorkoutList`.

- Component-propagatie van token:
  - `App` geeft `token` door aan `WorkoutForm` en `WorkoutList`.
  - `WorkoutList` geeft `token` door aan elke `WorkoutItem`.
  - `WorkoutItem` geeft `token` door aan `UpdateWorkout` en `DeleteWorkout`.

3) Specifieke request-wijzigingen (frontend) — waarom en hoe

- POST (aanmaken): `WorkoutForm.jsx` voegt header toe als `token` aanwezig is:

```js
const headers = { 'Content-Type': 'application/json' };
if (token) headers['Authorization'] = `Bearer ${token}`;
fetch('/api/workouts', { method: 'POST', headers, body: JSON.stringify(workout) });
```

- PATCH (bewerken): `UpdateWorkout.jsx` controleert eerst of `token` aanwezig is en voegt header toe bij PATCH. Als token ontbreekt geeft het component de foutmelding `Je moet ingelogd zijn`.

- DELETE: `DeleteWorkout.jsx` controleert token en voegt header toe bij DELETE. Bij afwezigheid van token geeft het `Je moet ingelogd zijn`.

4) Waarom dit de oorspronkelijke kwetsbaarheid oplost (eind-tot-eind)

- Backend fix: zorgt ervoor dat elke wijziging/verwijdering alleen slaagt als de ingelogde gebruiker tegelijk de eigenaar is (server-side check).
- Frontend fix: zorgt dat de juiste `Authorization` header wordt meegestuurd bij alle relevante requests. Zonder deze header zou de backend `req.user` niet kunnen bepalen en requests afwijzen.

5) Testen (kort)

- Stappen:
  1. Start backend en frontend.
  2. Registreer twee accounts A en B.
  3. Log in als A, maak workout(s). Log in als B, maak workout(s).
  4. Probeer met A's sessie B's workout te verwijderen — dit moet falen (404 of foutmelding).

- Handige curl-voorbeelden:

GET workouts:
```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:4000/api/workouts
```

DELETE workout:
```bash
curl -X DELETE -H "Authorization: Bearer <TOKEN>" http://localhost:4000/api/workouts/<ID>
```

6) Bestanden-overzicht (kort)

- Backend:
  - `backend/src/controllers/workoutController.js` (gebruik van `findOneAndDelete` / `findOneAndUpdate`)

- Frontend:
  - `frontend/src/App.jsx` — token state, fetchWorkouts met header, conditional rendering
  - `frontend/src/components/Auth.jsx` — login/register toggle
  - `frontend/src/components/Login.jsx` — opslag token en callback
  - `frontend/src/components/Register.jsx` — opslag token en callback
  - `frontend/src/components/WorkoutForm.jsx` — POST met header
  - `frontend/src/components/WorkoutList.jsx` / `WorkoutItem.jsx` — prop-forwarding
  - `frontend/src/components/UpdateWorkout.jsx` — PATCH met header
  - `frontend/src/components/DeleteWorkout.jsx` — DELETE met header

Als je wilt, kan ik nu nog concrete code-snippets toevoegen voor elk aangepast bestand (hele functies) of automatische tests schrijven die de autorisatie controleren.

---
Laat me weten of je volledige functie-implementaties in het bestand wilt of dat deze uitleg voldoende is.
- Automatische tests toevoegen die deze autorisatie controleren.
- De CHANGES_NL.md verder uitbreiden met concrete curl-voorbeelden voor elk endpoint.

Laat me weten welke vervolgstap je wilt.