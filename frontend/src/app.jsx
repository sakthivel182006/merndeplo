import { useState } from 'preact/hooks'
import './app.css'

const app=()=>{
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle input change for all fields
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, email, password } = formData

    // Simple validation: check if all fields are filled
    if (!name || !email || !password) {
      setMessage('All fields are required!')
      return
    }

    setIsLoading(true)  // Start loading state

    try {
      // Send form data to the backend API
      const response = await fetch('http://localhost:5000/api/Products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Registration successful for ${name}!`)
      } else {
        setMessage(data.message || 'Failed to register.')
      }
    } catch (error) {
      setMessage('An error occurred while registering.')
    } finally {
      setIsLoading(false)  // Stop loading state
    }

    // Optionally clear the form after successful registration
    setFormData({
      name: '',
      email: '',
      password: '',
    })
  }

  return (
    <div className="registration-form">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onInput={handleChange}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onInput={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onInput={handleChange}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Register'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
export default app;
