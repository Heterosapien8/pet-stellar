#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq, Ord, PartialOrd)]
pub struct Pet {
    pub name: String,
    pub hunger: i32,
    pub happiness: i32,
}

#[contract]
pub struct PetStellar;

#[contractimpl]
impl PetStellar {
    pub fn create_pet(env: Env, owner: Address, name: String) {
        let mut pets: Map<Address, Pet> = Self::get_all_pets(&env);
        let pet = Pet {
            name,
            hunger: 50,
            happiness: 50,
        };
        pets.set(owner.clone(), pet);
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "pets"), &pets);
    }

    pub fn feed_pet(env: Env, owner: Address) {
        let mut pets: Map<Address, Pet> = Self::get_all_pets(&env);
        if let Some(mut pet) = pets.get(owner.clone()) {
            pet.hunger = (pet.hunger - 10).max(0);
            pet.happiness = (pet.happiness + 5).min(100);
            pets.set(owner.clone(), pet);
            env.storage()
                .persistent()
                .set(&Symbol::new(&env, "pets"), &pets);
        }
    }

    pub fn play_pet(env: Env, owner: Address) {
        let mut pets: Map<Address, Pet> = Self::get_all_pets(&env);
        if let Some(mut pet) = pets.get(owner.clone()) {
            pet.happiness = (pet.happiness + 10).min(100);
            pets.set(owner.clone(), pet);
            env.storage()
                .persistent()
                .set(&Symbol::new(&env, "pets"), &pets);
        }
    }

    pub fn get_pet_status(env: Env, owner: Address) -> Option<Pet> {
        let pets: Map<Address, Pet> = Self::get_all_pets(&env);
        pets.get(owner)
    }

    fn get_all_pets(env: &Env) -> Map<Address, Pet> {
        env.storage()
            .persistent()
            .get(&Symbol::new(env, "pets"))
            .unwrap_or(Map::new(env))
    }
}
