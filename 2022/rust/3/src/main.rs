use array_tool::vec::Intersect;
use std::{collections::HashMap, env};

fn str_intersect(a: &str, b: &str) -> Vec<char> {
    return a.chars().collect::<Vec<char>>().intersect(b.chars().collect::<Vec<char>>());
}

fn main() {
    // Open and read the file
    let cwd = env::current_dir().unwrap().into_os_string().into_string().unwrap();
    let text = std::fs::read_to_string(cwd + "/resources/input.txt")
        .expect("Something went wrong reading the file");
    let lines = text.lines().collect::<Vec<_>>();
    
    // Build priorities map
    let mut prios = HashMap::new();
    let mut i = 1;
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    alphabet.chars()
        .for_each(|c| { prios.insert(c, i); i += 1; });
    alphabet.to_ascii_uppercase().chars()
        .for_each(|c| { prios.insert(c, i); i += 1; });

    // Part One
    let sum_of_halves: _ = lines.iter()
        .map(|s| -> Vec<_> {
            let (first, second) = s.split_at(s.len() / 2);
            return str_intersect(first, second);
        })
        .map(|v| -> i32 {
            return v.iter()
                .map(|c| prios.get(&c).unwrap())
                .sum()
        })
        .sum::<i32>();
        
    // Part Two
    let sum_of_badges = lines.chunks(3) // <-- Sick 🤯
        .map(|g| -> Vec<_> {
            let (first, second, third) = (g[0], g[1], g[2]);
            return str_intersect(first, second).intersect(third.chars().collect::<Vec<char>>());
        })
        .map(|v| -> i32 {
            return v.iter()
                .map(|c| prios.get(&c).unwrap())
                .sum()
        })
        .sum::<i32>();

    println!("Part One: {:?}", sum_of_halves);
    println!("Part Two: {:?}", sum_of_badges);
}
