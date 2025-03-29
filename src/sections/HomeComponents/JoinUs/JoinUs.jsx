import "./JoinUs.css"
import { useNavigate } from "react-router-dom" // ✅ Use react-router-dom

function JoinUs() {
  const navigate = useNavigate() // ✅ Use navigate instead of router

  const handleJoinClick = () => {
    navigate("/gopro") // ✅ Use navigate instead of router.push
  }

  return (
    <div className="join-container">
      <div className="join-content">
        <h1 className="join-heading">
          Join AION AI and
          <br />
          Shape Your Financial Future
        </h1>
        <button className="join-button" onClick={handleJoinClick}>
          Join Today
        </button>
      </div>
    </div>
  )
}

export default JoinUs
