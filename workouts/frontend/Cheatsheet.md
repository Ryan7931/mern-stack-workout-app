# Eindopdracht Cheat Sheet (React + Auth + Protected MERN)

Deze cheat sheet helpt je stap voor stap om **register/login/logout** en **protected routes** te bouwen in je React frontend.

---

## 0) Voorbereiding

- Backend draait al met:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - beveiligde routes op `/api/workouts`
- Frontend draait op Vite/React.
- Zorg dat je API-base URL klopt (bijv. `http://localhost:3000`).

Tip: maak één constante voor je API URL, zodat je niet overal losse URL's hoeft te typen.

```js
const API_URL = 'http://localhost:3000'
```

---

## 1) Register component

Doel:
- formulier met `email` + `password`
- `POST /api/auth/register`
- token opslaan in `localStorage`
- foutmelding tonen

### Basis flow

1. Gebruiker vult email/wachtwoord in.
2. `fetch('/api/auth/register', { method: 'POST' ... })`
3. Bij succes: token terugkrijgen en opslaan.
4. Naar workouts pagina navigeren.
5. Bij error: foutmelding laten zien.

### Voorbeeldcomponent

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registreren mislukt')
      }

      localStorage.setItem('token', data.token)
      navigate('/workouts')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Even wachten...' : 'Register'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

---

## 2) Login component

Doel is bijna hetzelfde als register, maar endpoint wordt:
- `POST /api/auth/login`

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Inloggen mislukt')
      return
    }

    localStorage.setItem('token', data.token)
    navigate('/workouts')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

---

## 3) Logout functie

Heel simpel:

```js
function logout() {
  localStorage.removeItem('token')
  // optioneel: navigate('/login')
}
```

Gebruik dit bijvoorbeeld in een nav bar knop:

```jsx
<button onClick={logout}>Logout</button>
```

---

## 4) Token meesturen bij alle workout requests

Voor **elke** call naar `/api/workouts` moet je header meesturen:

```js
const token = localStorage.getItem('token')

const res = await fetch(`${API_URL}/api/workouts`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

Ook bij `POST`, `PATCH`, `DELETE`:

```js
await fetch(`${API_URL}/api/workouts/${id}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

Met JSON body:

```js
await fetch(`${API_URL}/api/workouts`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ title, reps, load })
})
```

---

## 5) Routing + protected pagina's

Gebruik `react-router-dom` met routes voor:
- `/login`
- `/register`
- `/workouts` (beschermd)

### ProtectedRoute component

```jsx
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
```

### Route setup voorbeeld

```jsx
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import WorkoutsPage from './components/WorkoutsPage'
import ProtectedRoute from './components/ProtectedRoute'

function Nav() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/workouts">Workouts</Link> | <Link to="/login">Login</Link> |{' '}
      <Link to="/register">Register</Link>
      {token && <button onClick={logout}>Logout</button>}
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/workouts" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <WorkoutsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## Veelgemaakte fouten (en snelle fixes)

1. **Geen token in header** → altijd `Authorization: Bearer ...` toevoegen.
2. **Verkeerde API URL** → check poort/backend URL.
3. **`res.json()` error** → backend geeft soms geen JSON terug; check backend response.
4. **Token staat niet in localStorage** → check `localStorage.setItem('token', data.token)`.
5. **Protected route werkt niet** → controleer of token key exact `'token'` is.

---

## Mini-checklist voor inleveren

- [ ] Register werkt en slaat token op
- [ ] Login werkt en slaat token op
- [ ] Logout verwijdert token
- [ ] Alle workout fetch calls sturen Bearer token mee
- [ ] Workouts pagina is beschermd (alleen ingelogd)
- [ ] Navigatie tussen login/register/workouts werkt
- [ ] Foutmeldingen zijn zichtbaar voor gebruiker

Succes — als je deze checklist afvinkt, heb je een complete beveiligde MERN app 🚀