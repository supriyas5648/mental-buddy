import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    avatar: "",
    age: null,
    location: "",
    preferences: { buddy: "female", buddyName: "Mental Buddy" } // default
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    avatar: "",
    age: null,
    location: "",
    preferences: { buddy: "female", buddyName: "Mental Buddy" }
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: "Bearer " + token
          }
        });

        if (response.data && response.data._id) {
          setProfile(response.data);
          setEditData({
            name: response.data.name || "",
            bio: response.data.bio || "",
            avatar: response.data.avatar || "",
            age: response.data.age || null,
            location: response.data.location || "",
            preferences: {
              buddy: response.data.preferences?.buddy || "female",
              buddyName: response.data.preferences?.buddyName || "Mental Buddy"
            }
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("PROFILE FETCH ERROR:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle file upload for profile photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({
          ...editData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile photo (set to empty string)
  const handleRemovePhoto = () => {
    setEditData({
      ...editData,
      avatar: ""
    });
  };

  // Handle name change
  const handleNameChange = (e) => {
    setEditData({
      ...editData,
      name: e.target.value
    });
  };

  // handle buddy preference change
  const handleBuddyChange = (e) => {
    setEditData({
      ...editData,
      preferences: {
        ...editData.preferences,
        buddy: e.target.value
      }
    });
  };

  // handle buddy name change
  const handleBuddyNameChange = (e) => {
    setEditData({
      ...editData,
      preferences: {
        ...editData.preferences,
        buddyName: e.target.value
      }
    });
  };

  // Handle bio change
  const handleBioChange = (e) => {
    setEditData({
      ...editData,
      bio: e.target.value
    });
  };

  // Handle age change
  const handleAgeChange = (e) => {
    setEditData({
      ...editData,
      age: e.target.value ? parseInt(e.target.value) : null
    });
  };

  // Handle location change
  const handleLocationChange = (e) => {
    setEditData({
      ...editData,
      location: e.target.value
    });
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/profile`,
        {
          name: editData.name,
          bio: editData.bio,
          avatar: editData.avatar,
          age: editData.age,
          location: editData.location,
          preferences: editData.preferences // includes buddy
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      // Update local profile state
      setProfile({
        ...profile,
        name: editData.name,
        bio: editData.bio,
        avatar: editData.avatar,
        age: editData.age,
        location: editData.location,
        preferences: editData.preferences
      });

      setIsEditing(false);
      setSaving(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
      setSaving(false);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return <h2 className="loading">Loading profile...</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        {/* Profile Display Section */}
        {!isEditing ? (
          <div className="profile-display">
            <div className="profile-photo-section">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">
                  <span>📷</span>
                </div>
              )}
            </div>

            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <p>{profile.name || "Not set"}</p>
              </div>

              <div className="info-item">
                <label>Bio:</label>
                <p>{profile.bio || "No bio added yet"}</p>
              </div>

              <div className="info-item">
                <label>Age:</label>
                <p>{profile.age || "Not set"}</p>
              </div>

              <div className="info-item">
                <label>Location:</label>
                <p>{profile.location || "Not set"}</p>
              </div>

              <div className="info-item">
                <label>Buddy avatar:</label>
                <p>{(profile.preferences && profile.preferences.buddy) || "female"}</p>
              </div>

              <div className="info-item">
                <label>Buddy name:</label>
                <p>{(profile.preferences && profile.preferences.buddyName) || "Mental Buddy"}</p>
              </div>
            </div>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Update Profile
            </button>
          </div>
        ) : (
          /* Profile Edit Section */
          <div className="profile-edit">
            <div className="edit-photo-section">
              {editData.avatar ? (
                <>
                  <img src={editData.avatar} alt="Profile Preview" className="profile-photo" />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={handleRemovePhoto}
                  >
                    Remove Photo
                  </button>
                </>
              ) : (
                <div className="profile-photo-placeholder">
                  <span>📷</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="photo-label">
                Choose Photo
              </label>
            </div>

            <div className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={editData.name}
                  onChange={handleNameChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  value={editData.age || ""}
                  onChange={handleAgeChange}
                  placeholder="Your age"
                  min="13"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  value={editData.location}
                  onChange={handleLocationChange}
                  placeholder="Your city or region"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio:</label>
                <textarea
                  id="bio"
                  value={editData.bio}
                  onChange={handleBioChange}
                  placeholder="Tell us about yourself..."
                  rows="5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="buddy">Choose Buddy</label>
                <select
                  id="buddy"
                  value={editData.preferences.buddy}
                  onChange={handleBuddyChange}
                >
                  <option value="female">Female Buddy</option>
                  <option value="male">Male Buddy</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="buddyName">Buddy Name</label>
                <input
                  type="text"
                  id="buddyName"
                  value={editData.preferences.buddyName}
                  onChange={handleBuddyNameChange}
                  placeholder="Enter your buddy's name"
                />
              </div>

              <div className="form-actions">
                <button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      name: profile.name || "",
                      bio: profile.bio || "",
                      avatar: profile.avatar || "",
                      age: profile.age || null,
                      location: profile.location || "",
                      preferences: {
                        buddy: profile.preferences?.buddy || "female",
                        buddyName: profile.preferences?.buddyName || "Mental Buddy"
                      }
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
