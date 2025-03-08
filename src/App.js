import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function App() {
  const [Friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedfriend, setselectedfriend] = useState(null);
  function handleshowaddfriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(Friend) {
    setFriends((Friends) => [...Friends, Friend]);
    setShowAddFriend(false);
  }
  function handleSelection(Friend) {
    // setselectedfriend(friend);
    setselectedfriend((cur) => (cur?.id === Friend.id ? null : Friend));
    setShowAddFriend(null);
  }
  function handleSplit(value) {
    setFriends((Friends) =>
      Friends.map((Friend) =>
        Friend.id === selectedfriend.id
          ? { ...Friend, balance: Friend.balance + value }
          : Friend
      )
    );
    setselectedfriend((prev) => ({
      ...prev,
      balance: prev.balance + value
    }));
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          Friends={Friends}
          selectedfriend={selectedfriend}
          onSelect={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleshowaddfriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplitBill selectedfriend={selectedfriend} onSplit={handleSplit} />
      )}
    </div>
  );
}
function FriendList({ Friends, onSelect, selectedfriend }) {
  return (
    <ul>
      {Friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedfriend={selectedfriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedfriend }) {
  const isSelected = selectedfriend && selectedfriend.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label> 🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedfriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidbyUser, setpaidbyUser] = useState("");
  const paidbyFriend = bill ? bill - paidbyUser : "";
  const [whoisPaying, setWhoisPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidbyUser) return;
    onSplit(whoisPaying === "user" ? paidbyFriend : -paidbyUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedfriend?.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧑‍🤝‍🧑Your expense</label>
      <input
        type="text"
        value={paidbyUser}
        onChange={(e) =>
          setpaidbyUser(
            Number(e.target.value) > bill ? paidbyUser : Number(e.target.value)
          )
        }
      />

      <label>{selectedfriend?.name}'s expense</label>
      <input type="text" disabled value={paidbyFriend} />

      <label> Who is paying the bill</label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhoisPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedfriend?.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
export default App;
