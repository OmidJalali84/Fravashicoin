// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Fravashicoin is ERC20, Ownable {
    enum Sides {
        Left,
        Middle,
        Right
    }
    // Each lock records the amount and when it unlocks.
    struct Lock {
        uint256 amount;
        uint256 releaseTime;
    }

    struct User {
        string username;
        address upline;
        Sides place;
        uint256 registerTime;
        uint256 unlockedLevels;
        uint256 entryAmount;
        uint256 entryToken;
        uint256 upgradedAmount;
        uint256 totalFrozenTokens;
        uint256 firstDirectLock;
        uint256 thirdDirectLock;
        uint256 directs;
        address right;
        address middle;
        address left;
        bool active;
    }

    IERC20 DAI;

    uint256 public constant LOCK_DURATION = 365 days;

    uint256 public constant INITIAL_SUPPLY = 1e27;
    uint256 public constant MINIMUM_SUPPLY = 1e26; //@?

    uint256 public constant FEE = 1;
    uint256 public constant REFISTERATION_FEE = 5;

    uint256 public constant DIVIDE = 100;

    uint256 public constant ONLY_REGISTERED_PERIOD = 365 days;
    uint256 public immutable END_OF_ONLY_REGISTERED;
    uint256 public constant MAXIMUM_SWAP_AMOUNT = 5e24; // FRV

    uint256 public PRICE_DECIMALS = 1e18;

    uint256 public swapLiquidity = 2e25;

    uint256 private constant LEVEL1_ENTRANCE = 10e18;
    uint256 private constant LEVEL2_ENTRANCE = 50e18;
    uint256 private constant LEVEL3_ENTRANCE = 150e18;
    uint256 private constant LEVEL4_ENTRANCE = 500e18;

    address DeFi;

    uint256[4] private levels = [2, 5, 10, 15];
    uint256[15] private rewardPercentages = [
        10,
        10,
        10,
        5,
        5,
        5,
        5,
        5,
        5,
        10,
        3,
        3,
        3,
        3,
        8
    ];

    address[] internal users;

    uint256 public startingDate;
    uint256 public totalUsers;
    uint256 public totalAmountIn;

    // Mapping from an address to its array of locks.
    mapping(address user => Lock[] locks) public locks;
    // Mapping from an address to its array of TransferLimit.
    mapping(address user => uint256 swapedTokens) public swapedTokens; // FRV

    mapping(address => User) public addressToUser;
    mapping(string => address) public userNameToAddress;

    mapping(address => uint256) public upgradeCredits;

    modifier swapPreCondition(
        address receiver,
        bool fravashiForDAI,
        uint256 inputAmount
    ) {
        // checkEndOfOnlyRegistered();
        checkValidAddress(receiver);
        _;
    }

    modifier regsiterPreConditions(address _upline, uint256 registerAmount) {
        _checkActivation(_upline);
        bool condition1 = registerAmount >= LEVEL1_ENTRANCE;
        require(condition1, "Insufficient Amount");

        bool condition2 = addressToUser[_upline].active ||
            _upline == address(0);
        require(condition2, "Upline Does Not Exist");

        bool condition3 = !addressToUser[msg.sender].active;
        require(condition3, "Caller Already Exists");

        _;
    }

    function checkEndOfOnlyRegistered() internal view {
        if (block.timestamp < END_OF_ONLY_REGISTERED) {
            require(
                addressToUser[msg.sender].active,
                "Only users can swap tokens"
            );
        }
    }

    function checkValidAddress(address receiver) internal pure {
        require(receiver != address(0), "Invalid Receiver");
    }

    constructor(
        address initialOwner,
        address dai,
        address _DeFi
    ) ERC20("Fravashicoin", "FRV") Ownable(initialOwner) {
        DAI = IERC20(dai);
        DeFi = _DeFi;
        END_OF_ONLY_REGISTERED = block.timestamp + ONLY_REGISTERED_PERIOD;

        User memory user = addressToUser[initialOwner];
        user.registerTime = block.timestamp;
        user.unlockedLevels = 15;
        user.entryAmount = LEVEL4_ENTRANCE;

        addressToUser[initialOwner] = user;
        addressToUser[initialOwner].active = true;

        startingDate = block.timestamp;
        totalUsers++;
        users.push(initialOwner);

        _transferTokenEquivalent(initialOwner, LEVEL4_ENTRANCE, price());
    }

    ///////////////////////////
    //         SWAP          //
    ///////////////////////////

    function addLiquidty(uint256 amount) external {
        bool condition4 = DAI.transferFrom(msg.sender, address(this), amount);
        require(condition4, "Transfer Failed");
    }

    function swap(
        address receiver,
        bool fravashiForDAI,
        uint256 inputAmount
    ) external swapPreCondition(receiver, fravashiForDAI, inputAmount) {
        if (fravashiForDAI) {
            _swapFravashiForDAI(receiver, inputAmount);
        } else {
            _swapDAIForFravashi(receiver, inputAmount);
        }
    }

    function _swapFravashiForDAI(
        address receiver,
        uint256 fravashiAmount
    ) internal {
        uint256 daiAmount = (fravashiAmount * price()) / PRICE_DECIMALS;
        uint256 fee = _calculateSwapFee(daiAmount);
        require(
            daiAmount > 0,
            "Invalid output. Please increase your input amount"
        );

        swapLiquidity += fravashiAmount;
        _decreaseSwappedTokens(fravashiAmount);

        _burn(msg.sender, fravashiAmount);

        require(DAI.transfer(receiver, daiAmount + fee), "DAI transfer faild");
    }

    function _swapDAIForFravashi(address receiver, uint256 daiAmount) internal {
        uint256 fravashiAmount = (daiAmount * PRICE_DECIMALS) / price();
        uint256 fee = _calculateSwapFee(daiAmount);
        require(
            fravashiAmount > 0,
            "Invalid output. Please increase your input amount"
        );
        require(swapLiquidity >= fravashiAmount, "Insufficient FRV liquidity");

        swapLiquidity -= fravashiAmount;
        _increaseSwappedTokens(fravashiAmount);

        _mint(receiver, fravashiAmount);
        require(
            DAI.transferFrom(msg.sender, address(this), daiAmount + fee),
            "DAI transfer faild"
        );
    }

    function _removeAtIndex(address account, uint256 index) internal {
        Lock[] storage ft = locks[account];
        require(index < ft.length, "Index out of bounds");

        // Shift each element to the left to fill the gap.
        for (uint i = index; i < ft.length - 1; i++) {
            ft[i] = ft[i + 1];
        }
        // Remove the last element (now duplicate) from the array.
        ft.pop();
    }

    function _lock(address account, uint256 amount, uint256 date) internal {
        Lock memory lock = Lock({amount: amount, releaseTime: date});
        locks[account].push(lock);
    }

    /**
     * @dev Internal function to remove expired locks for a given account.
     * It iterates over the locks and removes any for which the release time has passed.
     */
    function _updateLocks(address account) internal {
        Lock[] storage userLocks = locks[account];
        uint256 i = 0;
        while (i < userLocks.length) {
            // If the current lock has expired, remove it
            if (block.timestamp >= userLocks[i].releaseTime) {
                _removeAtIndex(account, i);
            } else {
                i++;
            }
        }
    }

    /**
     * @dev Returns the total amount of tokens still locked for an account.
     */
    function _lockedAmount(
        address account
    ) internal view returns (uint256 locked) {
        Lock[] storage userLocks = locks[account];
        for (uint256 i = 0; i < userLocks.length; i++) {
            if (block.timestamp < userLocks[i].releaseTime) {
                locked += userLocks[i].amount;
            }
        }
    }

    /**
     * @dev Returns the unlocked (transferable) token balance for an account.
     */
    function unlockedBalance(address account) external view returns (uint256) {
        uint256 locked = _lockedAmount(account);
        return balanceOf(account) - locked;
    }

    function _calculateSwapFee(uint256 amount) internal pure returns (uint256) {
        return (amount * FEE) / DIVIDE;
    }

    function DAIBalance() public view returns (uint256) {
        return DAI.balanceOf(address(this));
    }

    function price() public view returns (uint256) {
        if (totalSupply() == 0) {
            return PRICE_DECIMALS / 10000;
        }
        return ((DAIBalance()) * PRICE_DECIMALS) / totalSupply();
    }

    function _decreaseSwappedTokens(uint256 amount) internal {
        if (swapedTokens[msg.sender] < amount) {
            swapedTokens[msg.sender] = 0;
        }
    }

    function _increaseSwappedTokens(uint256 amount) internal {
        require(
            swapedTokens[msg.sender] + amount < MAXIMUM_SWAP_AMOUNT,
            "Swapped tokens limit is reached"
        );

        swapedTokens[msg.sender] += amount;
    }

    function _transferFromContract(address receiver, uint256 amount) internal {
        _approve(address(this), msg.sender, amount);
        require(
            transferFrom(address(this), receiver, amount),
            "Fravashi transfer faild"
        );
    }

    /**
     * @dev Overrides the _update function from ERC20.
     * Before transferring, it updates the sender’s locks and ensures
     * they have enough unlocked tokens.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (from != address(0) && to != address(0) && from != address(this)) {
            // Clean up expired locks for the sender
            _updateLocks(from);

            uint256 fee = (value * FEE) / DIVIDE;

            // Check sender's available balance (total balance minus locked tokens)
            uint256 senderLocked = _lockedAmount(from);

            require(
                balanceOf(from) >= value + senderLocked + fee,
                "Transfer exceeds unlocked balance"
            );

            _burn(msg.sender, fee);
        }

        // Perform the token transfer
        super._update(from, to, value);
    }

    ///////////////////////////
    //    Referral System    //
    ///////////////////////////

    function register(
        address _user,
        address _upline,
        uint256 registerAmount,
        string memory username
    ) external regsiterPreConditions(_upline, registerAmount) {
        if (_upline == address(0)) {
            _upline = owner();
        }

        uint256 priceBeforeAction = price();
        _transferTokenEquivalent(_user, registerAmount, priceBeforeAction);
        uint256 amountToTransfer = (registerAmount *
            (DIVIDE + REFISTERATION_FEE)) / DIVIDE;
        bool condition4 = DAI.transferFrom(
            msg.sender,
            address(this),
            amountToTransfer
        );
        require(condition4, "Transfer Failed");

        User storage user = addressToUser[_user];
        user.entryAmount = registerAmount;
        user.registerTime = block.timestamp;
        user.active = true;
        user.username = username;
        userNameToAddress[username] = _user;

        _specifyPlace(_upline, _user);

        if (user.place == Sides.Left) {
            _firstInvitationAction(_user, _upline, priceBeforeAction);
        } else if (user.place == Sides.Middle) {
            _distributeRewards(
                _user,
                user.upline,
                registerAmount,
                priceBeforeAction
            );
        } else {
            _distributeRewards(
                _user,
                user.upline,
                registerAmount,
                priceBeforeAction
            );
            _transferThirdReward(user.upline, priceBeforeAction);
        }

        user.unlockedLevels = _getUnlockedLevels(registerAmount);
        totalUsers++;
        totalAmountIn += registerAmount;
        users.push(_user);
    }

    function upgradePlan(address _user, uint256 amountToUpgrade) public {
        User storage user = addressToUser[_user];
        require(
            amountToUpgrade >= 10e18,
            "Insufficient amount to upgrade. Please select an amount more than 10$"
        );

        uint256 priceBeforeAction = price();

        if (amountToUpgrade > upgradeCredits[msg.sender]) {
            uint256 amountToTransfer = amountToUpgrade -
                upgradeCredits[msg.sender];
            upgradeCredits[msg.sender] = 0;
        } else {
            upgradeCredits[msg.sender] -= amountToUpgrade;
        }

        if (user.place == Sides.Left) {
            _transferFirstInvitation(
                user.upline,
                amountToUpgrade,
                addressToUser[user.upline].directs == 3,
                priceBeforeAction
            );
        } else {
            _distributeRewards(
                _user,
                user.upline,
                amountToUpgrade,
                priceBeforeAction
            );
        }

        user.upgradedAmount += amountToUpgrade;
        user.unlockedLevels = _getUnlockedLevels(
            user.upgradedAmount + user.entryAmount
        );
        totalAmountIn += amountToUpgrade;

        if (amountToUpgrade > user.firstDirectLock) {
            bool success = DAI.transfer(
                _user,
                amountToUpgrade - user.firstDirectLock
            );
            require(success, "Transfer Faild");
            user.firstDirectLock = 0;
            _transferTokenEquivalent(
                _user,
                amountToUpgrade - user.firstDirectLock,
                priceBeforeAction
            );
        } else {
            user.firstDirectLock -= amountToUpgrade;
        }
    }

    function activatePlan(address _user, uint256 amount) external {
        User storage user = addressToUser[_user];
        address upline = user.upline;
        require(user.registerTime != 0, "You have not registered yet");
        require(!user.active, "Your plan is still active");
        bool success = DAI.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer Faild");

        uint256 priceBeforeAction = price();

        user.entryAmount = amount;
        user.registerTime = block.timestamp;

        if (user.place == Sides.Left) {
            _firstInvitationAction(_user, upline, priceBeforeAction);
        } else if (user.place == Sides.Middle) {
            _distributeRewards(_user, upline, amount, priceBeforeAction);
        } else {
            _distributeRewards(_user, upline, amount, priceBeforeAction);
        }

        user.unlockedLevels = _getUnlockedLevels(amount);
        addressToUser[_user].active = true;
        totalAmountIn += amount;

        _transferTokenEquivalent(_user, amount, priceBeforeAction);
    }

    function _specifyPlace(address _upline, address _user) internal {
        User storage user = addressToUser[_user];
        User storage upline = addressToUser[_upline];

        if (upline.directs == 3) {
            _upline = _findEmptyPlace(_upline);
            upline = addressToUser[_upline];

            if (upline.directs == 0) {
                user.place = Sides.Middle;
                upline.middle = _user;
            } else if (upline.directs == 1) {
                if (upline.left == address(0)) {
                    user.place = Sides.Right;
                    upline.right = _user;
                } else {
                    user.place = Sides.Middle;
                    upline.middle = _user;
                }
            } else if (upline.directs == 2) {
                user.place = Sides.Right;
                upline.right = _user;
            }
        } else {
            if (upline.directs == 0) {
                user.place = Sides.Left;
                upline.left = _user;
            } else if (upline.directs == 1) {
                if (upline.left == address(0)) {
                    user.place = Sides.Left;
                    upline.left = _user;
                } else {
                    user.place = Sides.Middle;
                    upline.middle = _user;
                }
            } else if (upline.directs == 2) {
                if (upline.left == address(0)) {
                    user.place = Sides.Left;
                    upline.left = _user;
                } else {
                    user.place = Sides.Right;
                    upline.right = _user;
                }
            }
        }

        upline.directs++;
        user.upline = _upline;
    }

    function _findEmptyPlace(address _start) internal view returns (address) {
        // Start with the initial level containing only _start.
        address[] memory currentLevel = new address[](1);
        currentLevel[0] = _start;

        // Process each level one by one.
        while (true) {
            // Gather candidates from the current level.
            address[] memory candidates = new address[](currentLevel.length);
            uint256 candidateCount = 0;
            for (uint256 i = 0; i < currentLevel.length; i++) {
                if (_validCondidate(currentLevel[i])) {
                    candidates[candidateCount] = currentLevel[i];
                    candidateCount++;
                }
            }

            // If there are candidates in this level, pick one pseudo-randomly.
            if (candidateCount > 0) {
                uint256 rand = uint256(
                    keccak256(abi.encodePacked(block.timestamp, candidateCount))
                );
                uint256 chosenIndex = rand % candidateCount;
                return candidates[chosenIndex];
            }

            // No candidate found on the current level; gather immediate children (direct users) for the next level.
            uint256 nextCount = 0;
            for (uint256 i = 0; i < currentLevel.length; i++) {
                User storage user = addressToUser[currentLevel[i]];
                if (user.left != address(0)) {
                    nextCount++;
                }
                if (user.middle != address(0)) {
                    nextCount++;
                }
                if (user.right != address(0)) {
                    nextCount++;
                }
            }

            if (nextCount == 0) {
                break; // No further nodes to traverse.
            }

            // Build the next level array using only the immediate children.
            address[] memory nextLevel = new address[](nextCount);
            uint256 index = 0;
            for (uint256 i = 0; i < currentLevel.length; i++) {
                User storage user = addressToUser[currentLevel[i]];
                if (user.left != address(0)) {
                    nextLevel[index++] = user.left;
                }
                if (user.middle != address(0)) {
                    nextLevel[index++] = user.middle;
                }
                if (user.right != address(0)) {
                    nextLevel[index++] = user.right;
                }
            }

            // Move to the next level.
            currentLevel = nextLevel;
                   }

        revert("No empty place found");
    }

    function _firstInvitationAction(
        address user,
        address upline,
        uint256 priceBeforeAction
    ) internal {
        uint256 userRegisterAmount = addressToUser[user].entryAmount;
        uint256 uplineRegisterAmount = addressToUser[upline].entryAmount;

        if (uplineRegisterAmount >= userRegisterAmount) {
            _transferFirstInvitation(
                upline,
                userRegisterAmount,
                false,
                priceBeforeAction
            );
        } else {
            _transferFirstInvitation(
                upline,
                uplineRegisterAmount,
                false,
                priceBeforeAction
            );
            addressToUser[upline].firstDirectLock +=
                userRegisterAmount -
                uplineRegisterAmount;
        }
    }

    function _transferThirdReward(
        address upline,
        uint256 priceBeforeAction
    ) internal {
        bool success = DAI.transfer(
            upline,
            addressToUser[upline].thirdDirectLock
        );
        require(success, "Transfer Faild");

        _withdrawTokens(
            upline,
            addressToUser[upline].thirdDirectLock,
            priceBeforeAction
        );

        addressToUser[upline].thirdDirectLock = 0;
    }

    function _transferFirstInvitation(
        address receiver,
        uint256 amount,
        bool hasThreeDirects,
        uint256 priceBeforeAction
    ) internal {
        uint256 amountToTransfer;
        if (hasThreeDirects) {
            amountToTransfer = amount;
        } else {
            amountToTransfer = (amount * 90) / 100;
            uint256 lockAmount = amount - amountToTransfer;
            addressToUser[receiver].thirdDirectLock += lockAmount;
        }

        bool success = DAI.transfer(receiver, amountToTransfer);
        require(success, "Transfer Faild");

        _withdrawTokens(receiver, amountToTransfer, priceBeforeAction);
    }

    function _distributeRewards(
        address currentUser,
        address currentUpline,
        uint256 amount,
        uint256 priceBeforeAction
    ) internal {
        _transferToOwner((amount * 10) / 100);
        for (uint256 i; i < 15; i++) {
            if (currentUser != owner()) {
                if (addressToUser[currentUpline].unlockedLevels >= i + 1) {
                    _transferReward(
                        currentUpline,
                        amount,
                        i,
                        priceBeforeAction
                    );
                }
            } else {
                _transferRemainingRewards(i, amount);
                break;
            }
            currentUser = currentUpline;
            currentUpline = addressToUser[currentUpline].upline;
        }
    }

    function _transferReward(
        address receiver,
        uint256 amount,
        uint256 level,
        uint256 priceBeforeAction
    ) internal {
        uint256 amountOwned = (amount * rewardPercentages[level]) / 100;
        uint256 amountToSend = (amountOwned * 80) / 100;
        uint256 amountToUpgrade = (amountOwned * 10) / 100;
        uint256 amountToInvestInDeFiSystem = (amountOwned * 5) / 100;

        _withdrawTokens(receiver, amountToSend, priceBeforeAction);

        bool success1 = DAI.transfer(receiver, amountToSend);
        require(success1, "Transfer Faild");

        bool success2 = DAI.transfer(DeFi, amountToInvestInDeFiSystem);
        require(success2, "Transfer Faild");

        _upgradePlan(receiver, amountToUpgrade);
    }

    function _transferRemainingRewards(uint256 index, uint256 amount) internal {
        uint256 remainingRewards;
        for (index; index < 15; index++) {
            remainingRewards += (amount * rewardPercentages[index]) / 100;
        }

        bool success = DAI.transfer(owner(), remainingRewards);
        require(success, "Transfer Faild");
    }

    function _transferTokenEquivalent(
        address user,
        uint256 entryDai,
        uint256 priceBeforeAction
    ) internal {
        uint256 fravashiEquivalent = (entryDai * PRICE_DECIMALS) /
            priceBeforeAction;
        Lock memory lock = Lock({
            amount: fravashiEquivalent,
            releaseTime: block.timestamp + LOCK_DURATION
        });
        locks[user].push(lock);
        _mint(user, (fravashiEquivalent * 10) / 100);
    }

    function _getUnlockedLevels(
        uint256 amount
    ) internal view returns (uint256) {
        if (amount < LEVEL2_ENTRANCE) {
            return levels[0];
        } else if (amount >= LEVEL2_ENTRANCE && amount < LEVEL3_ENTRANCE) {
            return levels[1];
        } else if (amount >= LEVEL3_ENTRANCE && amount < LEVEL4_ENTRANCE) {
            return levels[2];
        } else {
            return levels[3];
        }
    }

    function _withdrawTokens(
        address sender,
        uint256 daiAmount,
        uint256 priceBeforeAction
    ) internal {
        if (balanceOf(sender) == 0) {
            return;
        }
        uint256 fravashiAmount = (daiAmount * PRICE_DECIMALS) /
            priceBeforeAction;

        if (balanceOf(sender) < (fravashiAmount * 10) / 100) {
            _burn(sender, balanceOf(sender));
        } else {
            _burn(sender, (fravashiAmount * 10) / 100);
        }
    }

    function _checkActivation(address user) internal {
        if (
            addressToUser[user].directs == 0 &&
            addressToUser[user].registerTime + 365 days < block.timestamp
        ) {
            addressToUser[user].active = false;
        }
    }

    function _upgradePlan(address _user, uint256 amountToUpgrade) internal {
        User storage user = addressToUser[_user];

        if (_user == owner()) {
            _transferToOwner(amountToUpgrade);
            return;
        }

        uint256 priceBeforeAction = price();

        if (user.place == Sides.Left) {
            bool hasThreeDirect = user.directs == 3;
            _increaseFirstInvitationCredit(
                user.upline,
                amountToUpgrade,
                hasThreeDirect,
                priceBeforeAction
            );
        } else {
            _distributeUpgradeCredits(
                _user,
                user.upline,
                amountToUpgrade,
                priceBeforeAction
            );
        }

        user.upgradedAmount += amountToUpgrade;
        user.unlockedLevels = _getUnlockedLevels(
            user.upgradedAmount + user.entryAmount
        );
        totalAmountIn += amountToUpgrade;
        _transferTokenEquivalent(_user, amountToUpgrade, priceBeforeAction);
    }

    function _distributeUpgradeCredits(
        address currentUser,
        address currentUpline,
        uint256 amount,
        uint256 priceBeforeAction
    ) internal {
        _transferToOwner((amount * 10) / 100);
        for (uint256 i; i < 15; i++) {
            if (currentUser != owner()) {
                if (addressToUser[currentUpline].unlockedLevels >= i + 1) {
                    _increaseUpgradeCredit(
                        currentUpline,
                        amount,
                        i,
                        priceBeforeAction
                    );
                }
            } else {
                _transferRemainingRewards(i, amount);
                break;
            }
            currentUser = currentUpline;
            currentUpline = addressToUser[currentUpline].upline;
        }
    }

    function _increaseUpgradeCredit(
        address receiver,
        uint256 amount,
        uint256 level,
        uint256 priceBeforeAction
    ) internal {
        uint256 amountOwned = (amount * rewardPercentages[level]) / 100;
        uint256 amountToSend = (amountOwned * 90) / 100;
        uint256 amountToInvestInDeFiSystem = (amountOwned * 5) / 100;

        _withdrawTokens(receiver, amountToSend, priceBeforeAction);

        upgradeCredits[receiver] += amountToSend;

        bool success2 = DAI.transfer(DeFi, amountToInvestInDeFiSystem);
        require(success2, "Transfer Faild");
    }

    function _increaseFirstInvitationCredit(
        address receiver,
        uint256 amount,
        bool hasThreeDirects,
        uint256 priceBeforeAction
    ) internal {
        uint256 amountToTransfer;
        if (hasThreeDirects) {
            amountToTransfer = amount;
        } else {
            amountToTransfer = (amount * 90) / 100;
            uint256 lockAmount = amount - amountToTransfer;
            addressToUser[receiver].thirdDirectLock += lockAmount;
        }

        upgradeCredits[receiver] += amountToTransfer;

        _withdrawTokens(receiver, amountToTransfer, priceBeforeAction);
    }

    function _validCondidate(address user) public view returns (bool) {
        if (addressToUser[user].directs < 3) {
            if (
                addressToUser[user].directs == 2 &&
                addressToUser[user].left == address(0)
            ) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    function _transferToOwner(uint256 amount) internal {
        bool success = DAI.transfer(owner(), (amount * 50) / 100);
        require(success, "Transfer Faild");
    }

    function getUser(address user) public view returns (User memory) {
        return addressToUser[user];
    }

    function getUserByUsername(
        string memory username
    ) public view returns (User memory) {
        return addressToUser[userNameToAddress[username]];
    }

    function getUsers() public view returns (address[] memory) {
        return users;
    }
    
}
